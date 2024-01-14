const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let validator = require("validator");
const GamerSchema = new Schema({
    _id: {
        type: String,
        lowercase: true,
    },
    email: {
        type: String,
        lowercase: true,
        validate: (value) => {
            return validator.isEmail(value);
        },
    },
    username: String,
    firstName: String,
    lastName: String,
    contactNumber: String,
    password: String,
    userType: String,
    wishlist: [Object],
    cart: [Object]
});

module.exports = mongoose.model("gamers", GamerSchema);