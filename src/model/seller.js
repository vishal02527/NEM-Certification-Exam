const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let validator = require("validator");
const SellerSchema = new Schema({
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
});

module.exports = mongoose.model("sellers", SellerSchema);