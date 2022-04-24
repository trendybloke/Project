const mongoose = require('../config/dbconfig');

const AddressSchema = new mongoose.Schema({
    houseName: String,
    street: String,
    town: String,
    postcode: String,
    city: String,
    country: String
});

module.exports = AddressSchema;