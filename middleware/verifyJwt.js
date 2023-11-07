const jwt = require("jsonwebtoken");

const verifyJwt = (req, res, next) => {
    console.log(req.headers)
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401);//unauthorized
    console.log(authHeader)
    const token = authHeader.split(" ")[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            console.log(err)
            if (err) return res.sendStatus(403);//forbidden
            req.email = decoded.email;
            next();
        }
    );
}

module.exports = verifyJwt