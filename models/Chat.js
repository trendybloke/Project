const mongoose = require('../config/dbconfig');
const Message = require('./Message');

const ChatSchema = new mongoose.Schema({
    clientUsername: String,
    messages: [Message]
},
{timestamps: true});

module.exports = ChatSchema;