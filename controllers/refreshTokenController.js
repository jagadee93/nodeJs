
const fsPromises = require("fs").promises;
const path = require("path");
const jwt = require("jsonwebtoken");

const userData = {
    users: require(path.join(__dirname, "..", "model", "users.json")),
    setUsers(data) {
        this.users = data
    },
    async save() {
        await fsPromises.writeFile(path.join(__dirname, "..", "model", "users.json"), JSON.stringify(this.users));
    }
}

const verifyRefreshToken = (req, res) => {
    // console.log(req.headers.cookie) unparsed version of cookie 
    console.log(req.cookies) //if cookie parser is not used we'll get undefined here ...\
    const cookies = req.cookies;
    if (!cookies.jwt) return res.sendStatus(401);//unauthorized
    const refreshToken = cookies?.jwt;
    const foundUser = userData.users.find((user) => user.refreshToken === refreshToken);
    if (!foundUser) return res.sendStatus(403);

    //user found evaluate refreshToken

    try {
        jwt.verify(refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err) return res.sendStatus(403);
                const accessToken = jwt.sign(
                    { email: foundUser.email },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: "5m" }
                );
                res.json(accessToken)
            })
    } catch (err) {
        console.log(err)
    }
    console.log(foundUser)
    return res.sendStatus(500)
}


const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies.jwt) res.sendStatus(204);
    const refreshToken = cookies?.jwt;
    //is refresh token in db
    const foundUser = userData.users.find((user) => user.refreshToken === refreshToken);
    if (!foundUser) {
        //when deleting cookies we have to use the same options like when that cookie was created 
        res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, sameSite: "none", secure: true, })
        //max age and expiration are optional

        return res.sendStatus(204);
    }

    //we have the refresh token in db delete it 

    const updatedUserDb = userData.users.map((user) => {
        if (user.refreshToken === foundUser.refreshToken) {
            return { ...user, refreshToken: "" }
        }
        return user
    })
    userData.setUsers(updatedUserDb);
    await userData.save()
    res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }) //secure:true works with https only 
    return res.sendStatus(204) //no content 
}
module.exports = { verifyRefreshToken, handleLogout }

