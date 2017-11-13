'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = Schema({

	name:String,
	id:String,
	tel:String,
	email:String,
	tickets:Number,
	city:String,
	company:String
	
});

module.exports = mongoose.model('Student', studentSchema);