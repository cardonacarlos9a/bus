'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const companySchema = Schema({
	
	name:String,
	id:String,
	tel:String,
	tickets:Number,
	city:String

});

module.exports = mongoose.model('Company', companySchema);