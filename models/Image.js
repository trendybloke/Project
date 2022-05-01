const mongoose = require('../config/dbconfig');

// Image definition

const imageSchema = new mongoose.Schema({
    data: Buffer,
    contentType: String    
})

module.exports = imageSchema;