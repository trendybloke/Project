const mongoose = require('../config/dbconfig');

const MessageSchema = new mongoose.Schema({
    senderUsername: String,
    content: String
},
{timestamps: true});

module.exports = MessageSchema;