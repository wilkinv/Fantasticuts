var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// The address has to be different for every stylist
var StylistSchema = new Schema({
    name: String,
    phone_number: String,
    email: String,
    address: { type: String, unique: true },
    avg_rating: Number,
    avg_price: Number,
    style: String,
    location: { type: [Number], index: '2d'},
});

module.exports = mongoose.model('Stylist', StylistSchema);