const jwt = require("jsonwebtoken");
const user = require("../models/user");

const auth = async (req, res, next) => {
    try {
        const token = req.header("authorization");
        const decoded = jwt.verify(token, "user");

        req.userID = decoded.userID;
        req._id = decoded._id;

        next();
    } catch (e) {
        //console.log(e);
        err = { error: "User Token expired or malformed" };
        //console.log(err);
        req.error = err;
        console.log(err);
        next();
    }
};

module.exports = auth;
