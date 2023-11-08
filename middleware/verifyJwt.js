const jwt = require("jsonwebtoken");

const verifyJwt = (req, res, next) => {
    console.log(req.headers)
    const authHeader = req.headers.authorization || req.headers.Authorization; //it may be Upper case or lower case
    if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);//unauthorized
    console.log(authHeader) //Bearer Token
    const token = authHeader.split(" ")[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        { algorithms: ['HS256'] },
        (err, decoded) => {
            console.log(err)
            if (err) return res.sendStatus(403);//forbidden
            console.log(decoded)
            req.email = decoded.UserInfo.email;
            req.roles = decoded.UserInfo.roles
            next();
        }
    );
}

module.exports = verifyJwt