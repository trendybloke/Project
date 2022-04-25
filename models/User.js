const mongoose = require('../config/dbconfig');
const passportLocalMongoose = require("passport-local-mongoose");
const Address = require('./Address');

const options = {discriminatorKey: 'kind' };

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    passHash: String,
    forename: String,
    surname: String,
    address: Address,
    accountStatus: {
        type: String,
        enum: {
            values: ["active",
            "inactive",
            "suspended"],
            message: "{VALUE} is not a valid account status."
        }
    }
}, options );

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('users', UserSchema);