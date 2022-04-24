const mongoose = require('../config/dbconfig');
const User = require('./User');
const Chat = require('./Chat');

const SupportModel = User.discriminator('Support',
    new mongoose.Schema({
        chats: [Chat]
    })
);

module.exports = SupportModel;