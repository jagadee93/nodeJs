
const bcrypt = require("bcrypt");
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

const RegisterUser = async (req, res) => {
    const { user, password, email } = req.body;
    if (!user || !password || !email) return res.json({ "message": "Please provide all the fields" });

    const foundUser = userData.users.find((user) => user.email === email)
    if (foundUser) return res.status(409).json({ "message": "user already exists" }); //conflict
    try {
        const hashedPwd = await bcrypt.hash(password, 10)
        console.log(hashedPwd)
        const newUser = {
            user,
            password: hashedPwd,
            email,
            roles: {
                User: 2001
            }
        }
        userData.setUsers([...userData.users, newUser]);
        await userData.save();
        newUser.password = password;
        return res.status(201).json(newUser)

    } catch (err) {
        res.status(500).json({ "error": err.message })
    }

}

const userLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email) return res.json({ "message": "email is required" });
    if (!password) return res.json({ "message": "password is required.." });
    const foundUser = userData.users.find((user) => user.email === email)
    if (!foundUser) return res.json({ "message": "user not found" })
    try {
        const result = await bcrypt.compare(password, foundUser.password);
        console.log(result)
        if (!result) return res.status(401).json({ "message": "password is incorrect" })
        //create Jwt
        const roles = Object.values(foundUser.roles); //gives values 
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "email": foundUser.email,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "5m", algorithm: "HS256" }
        )

        const refreshToken = jwt.sign(
            {
                email: foundUser.email
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" }
        )

        const updatedUsers = userData.users.map((user) => {
            if (user.email === foundUser.email) {
                return { ...user, refreshToken }
            }
            return user
        });
        userData.setUsers(updatedUsers)
        await userData.save();
        console.log(foundUser) //
        //we also need to send refreshToken we can use cookies to do that 
        res.cookie("jwt", refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, sameSite: "none", secure: true, })
        return res.status(200).json({ email: foundUser.email, accessToken, refreshToken, },)
    } catch (err) {
        res.status(500).json({ "message": err.message })
    }

}

module.exports = {
    userLogin,
    RegisterUser
}


