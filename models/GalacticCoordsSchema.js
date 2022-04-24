const mongoose = require('../config/dbconfig');

// Coords definition
const CoordSchema = new mongoose.Schema({
    longitude: Number,
    latitude: Number
});

// Export
//module.exports = mongoose.model('galacticCoords', CoordSchema);

module.exports = CoordSchema;