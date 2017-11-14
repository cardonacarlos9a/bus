'use strict'

var mongoose = require('mongoose');

var studentSchema = new mongoose.Schema({

	name: String,
	id: String,
	tel: String,
	email: String,
	tickets: Number,
	city: String,
	company: String,
	estado: String

});

module.exports = mongoose.model('Student', studentSchema);
