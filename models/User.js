const mongoose = require('../config/dbconfig');
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

module.exports = mongoose.model('users', UserSchema);