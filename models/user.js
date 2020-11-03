const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    userID: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    let token;
    token = jwt.sign({ userID: user.userID, _id: user._id }, "user");
    user.token = token;
    await user.save();

    return token;
};

const user = mongoose.model("user", userSchema);

module.exports = user;
