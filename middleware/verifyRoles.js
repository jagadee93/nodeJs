const verifyRoles = (...allowedRoles) => { //[5150]
    return (req, res, next) => {
        if (!req.roles) return res.sendStatus(401)//unauthorized
        const userRoles = req?.roles //[1984,2001]
        const allowedRolesArr = [...allowedRoles] //[1984]
        console.log(allowedRoles);
        console.log(userRoles)
        const resultArr = userRoles.map((role) => allowedRolesArr.includes(role))
        //this gives [true,false]
        const result = resultArr.find((val) => val === true) //we need to find single true value 
        if (!result) return res.sendStatus(401); //there is no true value
        next();


    }
}

module.exports = verifyRoles