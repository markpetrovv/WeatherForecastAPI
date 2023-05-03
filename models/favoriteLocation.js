// the schema defines the structure of the favourite location data in DB
const {Schema, model} = require('mongoose');

const favoriteLocationSchema = new Schema ({
location: {
    type: String,
    required: true,
    unique: true,
},
createdAt: {
    type: Date,
    default: Date.now,
},
});

module.exports = model('FavoriteLocation', favoriteLocationSchema);