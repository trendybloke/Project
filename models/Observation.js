const mongoose = require('../config/dbconfig');
const GalacticCoords = require('../models/GalacticCoordsSchema');
const Comment = require('../models/CommentSchema')

// Observation definition
const ObservationSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: {
            values: ['elliptical', 'spiral', 'irregular'],
            message: '{VALUE} is not a valid category.'
        },
        required: true
    },
    title: {
        type: String,
        required: true,
        // unique: true
    },
    galacticCoords:{
        type: GalacticCoords,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    analyses:{ 
        type: [String],
        required: true
    },
    comments:{
        type: [Comment]
    },
    status:{
        type: String,
        enum: {
            values: ['visible', 'private', 'flagged', 'removed'],
            message: '{VALUE} is not a valid status.'
        },
        required: true
    }
},
{ timestamps: true }
);

// Export
module.exports = mongoose.model('observations', ObservationSchema);