const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
    //read header token
    const token = req.header('x-auth-token');
    // console.log(token); //read token with the header x-auth..p5.BandPass()

    //check if no token
    if (!token) {
        return res.status(401).json({msg: 'No token, no permission granted'})
    }
    try {
        const crypted = jwt.verify(token, process.env.SECRET);
        req.user = crypted.user;
        next();
    } catch (error) {
        res.status(401).json({msg: 'Token is not valid'})
    }

    //validate token
}