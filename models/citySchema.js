'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema

const citySchema = Schema({
	
	idCity : String,
	name : String,

});

module.exports = mongoose.model('City', citySchema);