const mongoose = require('../config/dbconfig');

// Comment definition
const CommentSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
},
{ timestamps: true }
);

// Export
module.exports = CommentSchema;