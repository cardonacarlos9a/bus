'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const entregaTiqueteSchema = Schema({
	
	idEstudiante : String,
	idEmpresa : String,
	idCity : String,
	fechaEntrega : Date,
	numeroTiquetes : Number

});

module.exports = mongoose.model('EntregaTiquete', entregaTiqueteSchema);