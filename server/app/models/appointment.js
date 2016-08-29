var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// The date has to be unique for the appointment
var AppointSchema = new Schema({
	date: { type: String, unique: true },
    name: String,
    phone_number: String,
    email: String,
    address: String,
    avg_rating: Number,
    avg_price: Number,
    style: String,
    username: String
});

module.exports = mongoose.model('Appointment', AppointSchema);