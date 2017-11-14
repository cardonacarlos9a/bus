var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multer = require('multer');
var cloudinary = require('cloudinary');
var method_override = require("method-override");
var app_password = "1234";
var password = false;
var c = 1;
var informacion;
var Student = require('./models/studentSchema');
var Company = require('./models/companySchema');
var City = require('./models/citySchema');
var entregaTiquetes = require('./models/entregaTiqueteSchema');
var consultas = require('./consultasMongo/consultas');


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://" + process.env.IP;

cloudinary.config({
	cloud_name: "dcbpeldar",
	api_key: "695991492773122",
	api_secret: "9bAgpPxJEA3x35n2iupsAVUQWaI"
});

var app = express();

mongoose.connect('mongodb://' + process.env.IP, {
	useMongoClient: true,
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({ dest: "./uploads" }));
app.use(method_override("_method"));

//Especificacion del motor de plantillas en este caso es jade
app.set("view engine", "jade");

app.use(express.static("public"));

app.get("/", function(solicitud, respuesta) {

	//respuesta.render("inicio/index");
	respuesta.redirect("/inicio");

});

app.get("/inicio", function(solicitud, respuesta) {

	//respuesta.render("Index");
	respuesta.render("inicio/index")
});

app.get("/mensaje", function(solicitud, respuesta) {

	//respuesta.render("Index");
	respuesta.render("mensaje/index")
});

/**
 * Método que permite cargar todos los estudiantes en mosaico
 */
app.get("/estudiante", function(solicitud, respuesta) {
	Student.find(function(error, documento) {
		if (error) {
			console.log(error);
		}
		respuesta.render("estudiante/index", { students: documento })
	});
});

/**
 * Método que permite cargar el index del Login con la lista de los estuduiantes
 */
app.get("/admin/login", function(solicitud, respuesta) {
	Student.find(function(error, documento) {
		if (error) {
			console.log(error);
		}
		respuesta.redirect("admin/login", { students: documento })
	});

	/*Company.find(function(error, documentoCompany) {
		if (error) {
			console.log(error);
		}
		respuesta.redirect("admin/login", { companies: documentoCompany})
	});*/

});

/**
 * Método que permite redirigir a la pestaña de edición de estudiante
 */
app.get("/estudiante/edit/:_id", function(solicitud, respuesta) {
	var id_student = solicitud.params._id;
	Student.findOne({ "_id": id_student }, function(error, estudiante) {
		console.log(estudiante);
		respuesta.render("estudiante/edit", { student: estudiante });
	});
});

/**
 * Método que permite redirigir a la pestaña de edición de estudiante
 */
app.get("/estudiante/info/", function(solicitud, respuesta) {
	var id_student = solicitud.body.id;
	console.log("Buscar id " + id_student);
	Student.findOne({ "id": id_student }, function(error, estudiante) {
		console.log("Estudiante encontrado es: " + estudiante);
		respuesta.render("estudiante/edit", { student: estudiante });
	});
});

/**
 * Metodo para actualizar un estudiante
 */
app.put("/estudiante/:_id", function(solicitud, respuesta) {

	if (solicitud.body.password == app_password) {
		var data = {
			name: solicitud.body.name,
			id: solicitud.body.id,
			tel: solicitud.body.tel,
			email: solicitud.body.email,
			tickets: solicitud.body.tickets,
			estado: solicitud.body.estado
		};

		/*if (solicitud.files.hasOwnProperty("image")) {

			cloudinary.uploader.upload(solicitud.files.image.path, function(result) {
				data.imageUrl = result.url;
				Student.update({ "_id": solicitud.params._id }, data, function(student) {
					respuesta.redirect("/estudiante");
				});
			});
		}
		else {*/
		Student.update({ "_id": solicitud.params._id }, data, function(student) {
			respuesta.redirect("/admin");
		});
		//}

	}
	else {
		respuesta.redirect("/admin");
	}
});

//Redirige a /inicio/soon"
app.get("/soon", function(solicitud, respuesta) {
	respuesta.render("inicio/soon");
});

/**
 * Metodo para realizar una entrega de tiquetes
 */
app.post("/inicio", function(solicitud, respuesta) {
	var res = "Respuesta del servidor: "
	console.log(" ")
	contador = c;
	console.log("Transacción número: " + contador)
	var data = {
		tickets: 0
	};
	c++;
	var id = solicitud.body.id


	Student.findOne({ "id": id }, function(error, estudiante) {

		var d = new Date();
		if (estudiante != null) {
			var tiquetes = estudiante.tickets
			var entregar = 0;
			if (tiquetes >= 10) {
				entregar = 10;
				informacion = {
					result: "Transacción exitosa el " + d,
					name: estudiante.name,
					id: estudiante.id,
					tiquetes: entregar,
					server: "Ahora tienes: " + (tiquetes - entregar) + " tiquetes de transporte disponibles",
					num: "Transacción número: " + contador + " "

				};

				var data = {
					tickets: tiquetes - entregar
				};
				console.log(res + "Información!: se entregaron: " + tiquetes + " tiquetes de transporte al estudiante: '" + estudiante.name + "'' con id: '" + estudiante.id + "'");

				//Codigo para registrar en la base de datos una entrega de tiquetes asociada a este estudiante
				var datosEntrega = {
					idEstudiante: estudiante.id,
					idEmpresa: 'pendiente',
					fechaEntrega: new Date(),
					numeroTiquetes: entregar
				};
				var entregaRealizada = new entregaTiquetes(datosEntrega);
				entregaRealizada.save(function(err) {
					//console.log(student);
				});

				Student.update({ "id": id }, data, function(student) {
					console.log(res + "Tiquetes disponibles ahora: 0")
					respuesta.render("inicio/msj", { info: informacion })

				});
			}
			else {
				informacion = {
					result: "Transacción no exitosa",
					name: estudiante.name,
					id: estudiante.id,
					tiquetes: 0,
					server: "La identificacíon: '" + id + "' No tiene tiquetes de transporte disponibles",
					num: "Transacción número: " + contador + " "

				};

				console.log(res + "Lo sentimos, el estudiante: '" + estudiante.name + "' con id: '" + estudiante.id + "' no tiene tiquetes disponibles.")
				respuesta.render("inicio/msj", { info: informacion })
			}
		}
		else {

			informacion = {
				result: "Transacción no exitosa",
				name: "Usuario no identificado",
				id: id,
				tiquetes: 0,
				server: "La identificacíon: '" + id + "' no se encuentra registrada en la base de datos",
				num: "Transacción número: " + contador + " "

			};

			console.log(res + "Lo sentimos, la identificacíon: '" + id + "' no se encuentra registrada en nuestra base de datos")
			//alert(res+"Lo sentimos, la identificacíon: '"+id+"' no se encuentra registrada en nuestra base de datos"); 
			respuesta.render("inicio/msj", { info: informacion })
		}

	})
	//respuesta.render("inicio/msj",{info: informacion})
})
/**
 * Método que permite cargar o no la ventana de lista de estudiantes (verifica contraseña ingresada)
 */
app.post("/admin", function(solicitud, respuesta) {
	if (solicitud.body.password == app_password) {
		password = true;
		Student.find(function(error, documento) {
			if (error) {
				console.log(error);
			}
			respuesta.render("admin/index", { students: documento });
		});
	}
	else {
		respuesta.redirect("/admin")
	}


});

/**
 * Método que permite ver la ventana de inicio
 */
app.get("/inicio", function(solicitud, respuesta) {

	respuesta.render("index")
})

/**
 * Método que permite iniciar sesion a un estudiante
 */
app.get("/admin", function(solicitud, respuesta) {

	if (password == false) {
		respuesta.render("admin/form")
	}
	else {
		Student.find(function(error, documento) {
			if (error) {
				console.log(error);
			}
			respuesta.render("admin/index", { students: documento })
		});

	}
})

// app.get("/admin", function(solicitud, respuesta) {

// 	respuesta.render("/estudiante/new");

// });
/**
 * Cierra la sesion del administrador autenticado y redirige a inicio
 */
app.get("/admin/salir", function(solicitud, respuesta) {

	password = false
	respuesta.redirect("/");
});

/**
 * Redirige a la pagina de reportes del adiministrador
 */
app.get("/admin/reportes", function(solicitud, respuesta) {
	if (password) {
		var consultaARelizar = solicitud.query['numConsulta'];
		console.log(consultaARelizar);


		consultas.FindinCol1().then(function(items) {
			//console.info('The promise was fulfilled with items!', items);
			respuesta.render("admin/reportes", { resultado: items, consulta:consultaARelizar });
		}, function(err) {
			console.error('The promise was rejected', err, err.stack);
		});


	}
	else { respuesta.redirect("/") };
});


/**
 * Metodo para registrar un estudiante
 */

app.post("/estudiante", function(solicitud, respuesta) {

	var data = {
		name: solicitud.body.name,
		id: solicitud.body.id,
		tel: solicitud.body.tel,
		email: solicitud.body.email,
		tickets: solicitud.body.tickets,
		estado: 'activo',
		city: solicitud.body.Ciudad,
		company: solicitud.body.Company

	}

	var student = new Student(data);

	/*if (solicitud.files.hasOwnProperty("image")) {
		cloudinary.uploader.upload(solicitud.files.image.path,
			function(result) {
				student.imageUrl = result.url;
				student.save(function(err) {
					//console.log(student);
					respuesta.redirect("/admin");
				});
			}
		);
	}
	else {
		student.save(function(err) {
			console.log(student);
			respuesta.redirect("/admin");
		});
	}*/

	student.save(function(err) {
		console.log(student);
		respuesta.redirect("/admin");
	});



});

/**
 * Método que permite ver la ventana de agregar un estudiante
 */
app.get("/estudiante/new", function(solicitud, respuesta) {



	City.find(function(error, documento) {
		if (error) {
			console.log(error);
		}

		Company.find(function(error, documento2) {
			if (error) {
				console.log(error);
			}

			respuesta.render("estudiante/new", { cities: documento, companies: documento2 });

		});
	});

	//respuesta.render("estudiante/new")
});

app.get("/admin/add_company", function(solicitud, respuesta) {

	City.find(function(error, documento) {
		if (error) {
			console.log(error);
		}
		respuesta.render("admin/add_company", { cities: documento });
	});
});

app.get("/estudiante/delete/:_id", function(solicitud, respuesta) {
	var id_student = solicitud.params._id;
	Student.findOne({ "_id": id_student }, function(error, estudiante) {
		respuesta.render("estudiante/delete", { student: estudiante })
	})
});

/**
 * Método que permite eliminar un estudiante
 */
app.delete("/estudiante/:_id", function(solicitud, respuesta) {
	var id_student = solicitud.params._id;
	if (solicitud.body.password == app_password) {
		Student.remove({ "_id": id_student }, function(error) {
			if (error) {
				console.log(error);
			}
		})
		//respuesta.redirect("/estudiante")
		//Student.find(function(error,documento){
		//	if(error){
		//		console.log(error);
		//	}
		respuesta.redirect("/admin") //,{students: documento})
		//});		
	}
	else {
		//respuesta.redirect("/estudiante")
		//Student.find(function(error,documento){
		//		if(error){
		//			console.log(error);
		//		}
		//	respuesta.redirect("/estudiante")
		respuesta.redirect("/admin") //,{students: documento})
		//	});	
	}
});

/**
 * Método para registrar una nueva empresa de transporte
 */
app.post("/add_company", function(solicitud, respuesta) {

	console.log("Registraré");
	var data = {
		name: solicitud.body.name,
		id: solicitud.body.id,
		tel: solicitud.body.tel,
		tickets: solicitud.body.tickets,
		city: solicitud.body.ciudad
	}

	var company = new Company(data);


	company.save(function(err) {
		console.log(company);
		respuesta.redirect("/company");
	});

});

/**
 * Metodo para eliminar una empresa de transporte
 */
app.delete("/company/:_id", function(solicitud, respuesta) {
	var id_company = solicitud.params._id;
	if (solicitud.body.password == app_password) {
		Company.remove({ "_id": id_company }, function(error) {
			if (error) {
				console.log(error);
			}
		})
		//respuesta.redirect("/estudiante")
		//Student.find(function(error,documento){
		//	if(error){
		//		console.log(error);
		//	}
		respuesta.redirect("/company") //,{students: documento})
		//});		
	}
	else {
		//respuesta.redirect("/estudiante")
		//Student.find(function(error,documento){
		//		if(error){
		//			console.log(error);
		//		}
		//	respuesta.redirect("/estudiante")
		respuesta.redirect("/company") //,{students: documento})
		//	});	
	}
});

/**
 * Metodo para actualizar una compañia
 */
app.put("/company/:_id", function(solicitud, respuesta) {

	if (solicitud.body.password == app_password) {
		var data = {
			name: solicitud.body.name,
			id: solicitud.body.id,
			tel: solicitud.body.tel,
			tickets: solicitud.body.tickets,
			city: solicitud.body.ciudad
		};

		/*if (solicitud.files.hasOwnProperty("image")) {

			cloudinary.uploader.upload(solicitud.files.image.path, function(result) {
				data.imageUrl = result.url;
				Student.update({ "_id": solicitud.params._id }, data, function(student) {
					respuesta.redirect("/estudiante");
				});
			});
		}
		else {*/
		Company.update({ "_id": solicitud.params._id }, data, function(company) {
			respuesta.redirect("/company");
		});
		//}

	}
	else {
		respuesta.redirect("/company");
	}
});

app.get("/company", function(solicitud, respuesta) {


	Company.find(function(error, documento) {
		if (error) {
			console.log(error);
		}
		respuesta.render("company/index", { companies: documento })
	});
})

/**
 * Método que permite redirigir a la pestaña de edición de empresa de transporte
 */
app.get("/company/edit/:_id", function(solicitud, respuesta) {
	var id_student = solicitud.params._id;
	Company.findOne({ "_id": id_student }, function(error, documento) {

		City.find(function(error, documento2) {
			if (error) {
				console.log(error);
			}
			respuesta.render("company/edit", { cities: documento2, company: documento });
		});
	});
});


/**
 * Método que permite redirigir a la pestaña de eliminar de empresa de transporte
 */
app.get("/company/delete/:_id", function(solicitud, respuesta) {
	var id_student = solicitud.params._id;
	Company.findOne({ "_id": id_student }, function(error, documento) {
		respuesta.render("company/delete", { company: documento });
	});
});


/**
 * Este metodo realiza la consulta de los estudiantes que estan suspendidos y devuelve
 * la lista con nombre, documento, telefono y correo electrónico
 */
function consultarEstudiantesSuspendidos() {




}



app.listen(process.env.PORT);
