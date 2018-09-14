'use strict';
var express= require('express'),
	fs= require('fs-extra'),
	getUsuario = require('./model').getUsuario,
	uploadUsuario = require('./model').uploadUsuario,
	editUsuario = require('./model').editUsuario,
	postponeFecha = require('./model').postponeFecha,
	
	getCarrera = require('./model').getCarrera,
	getCodigo = require('./model').getCodigo,
	saveReserva = require('./model').saveReserva,
	getAreas = require('./model').getAreas,
	getReservas = require('./model').getReservas,
	cancelReserva = require('./model').cancelReserva,
	getLastBook = require('./model').getLastBook,
	sendComentario = require('./model').sendComentario,
	getComentarios = require('./model').getComentarios,
	getBook = require('./model').getBook,
	getAuthorization = require('./model').getAuthorization,
	changePassword = require('./model').changePassword,
	waitBook = require('./model').waitBook,
	updateReserva = require('./model').updateReserva,
	waitingRoom = require('./model').waitingRoom,
	getWaitRoom = require('./model').getWaitRoom,
	getNotifications = require('./model').getNotifications,
	updateNotifications = require('./model').updateNotifications,
	getNotificacionesAdmin = require('./model').getNotificacionesAdmin,
	getPublicaciones = require('./model').getPublicaciones,
	getPublicacionAdmin = require('./model').getPublicacionAdmin,
	getLastBooks = require('./model').getLastBooks,
	updateReservas = require('./model').updateReservas,
	viewUsuario = require('./model').viewUsuario;

	
	var socket2=null; var ruta =null; var rutaLibro=null;

var discussController = function(app,io) 
{
	
	io.on('connection',function(socket){
		socket2 = socket;
    	console.log("usuario conectado");


    	
		socket.join('home');
		socket.join('perfil');
		socket.join('area');
		socket.join('libross');
		socket.join('viewBook');




    });




	app.route('/upload')
	 	.put(function(req,res){
	 		if(req.files.image){
		 		var extension = req.files.image.name.split('.');
				fs.copy(req.files.image.path,'public/upload/'+req.body.codigo+extension[0]+'.'+extension[1]);
				var source={file:req.body.codigo+req.files.image.name,codigo:req.body.codigo};
				uploadUsuario(source,function(error,data){
					res.send(data);
				});
			}else{
				editUsuario(req.body,function(error,data){
					res.send(data);
				});
			}
	 	});

	app.route('/postergar')
		.post(function(req,res){
			postponeFecha(req.body,function(error,data){
				res.send(data);
			});
		});

	app.route('/BooksApp')
	 	.get(function(req,res){
 			getAreas(function(error,data){
				res.send(data);
			});
	 	});

	app.route('/reservas')
	 	.get(function(req,res){
			getReservas(req.query,function(error,data){
				res.send(data)			
			});
	 	});

	app.route('/getUser')
	 	.get(function(req,res){
			getUsuario(req.query,function(error,data){
				res.send(data);
			});
	 	});
			
//fin de resource de la vista perfil
	app.route('/Carrera')
	 	.get(function(req,res){
	 		if(req.query.ruta){
	 			ruta = req.query;
	 			getCarrera(req.query,function(error,data){
					res.send(data);
				});
				//eliminamos libros
				setInterval(function(){
					getCarrera(ruta,function(error,data){
						// console.log(ruta);
						// console.log(data);
						io.to('area').emit('librosEliminados',data)
					})
				},1000);
		 	}
	 	});

	app.route('/getCod')
	 	.get(function(req,res){
 			getCodigo(req.query,function(error,data){
				res.send(data);
			});
	 	});
	app.route('/getLastBook')
	 	.get(function(req,res){
 			getLastBook(req.query,function(error,data){
				io.to('libross').emit('libro',data);
				res.send(data);
			});
	 	});

	app.route('/reservar')
	 	.post(function(req,res){
	 			saveReserva(req.body,function(error,data){
					res.send(data);
				}); 			
	 	});
	app.route('/comentar')
	 	.post(function(req,res){
	 		// console.log(socket2);
 			sendComentario(req.body,function(error,data){
	 				io.to('home').emit('comentando',{
	                    id_comentario:req.body.id_comentario,
	                    codigo_libro:req.body.codigo_libro,
	                    codigo_usuario:req.body.codigo_usuario,
	                    nombre_usuario:req.body.nombre_usuario,
	                    apellido_usuario:req.body.apellido_usuario,
	                    perfil_usuario:req.body.perfil_usuario,
	                    comentario_usuario:req.body.comentario_usuario,
	                    hora_comentada:req.body.hora_comentada,
	                    tipo:'comentario'
	                });
	 				res.send(data);
	 			})
	 	});

	app.route('/cancel')
	 	.delete(function(req,res){
			waitingRoom(req.query,function(error,data){
				io.to('perfil').emit('notificacion',data);
				io.to('libross').emit('notificacion2',data);
			})
			cancelReserva(req.query,function(error,data){
				res.send(data);
			});
	 	});

	app.route('/getBook')
		.get(function(req,res){
			rutaLibro = req.query;
			getBook(req.query,function(error,data){
				res.send(data);
			});

			//editar libro
			setInterval(function(){
					getBook(rutaLibro,function(error,data){
						io.to('viewBook').emit('libroEditado',data)
					})
				},1000);
		});
	app.route('/sendPass')
		.get(function(req,res){
			getAuthorization(req.query,function(error,data){
				res.send(data)
			});
		});

	app.route('/Book')
		.get(function(req,res){
			getComentarios(req.query,function(error,data){
				res.send(data)
			});
		});

	app.route('/change')
		.put(function(req,res){
			changePassword(req.body,function(error,data){
				res.send(data);
			});
		});

	app.route('/callWait')
		.get(function(req,res){
			getWaitRoom(req.query,function(error,data){
				res.send(data)
			});
		});

	app.route('/waitBook')
		.post(function(req,res){
			waitBook(req.body,function(error,data){
				res.send(data);
			});
		});
	app.route('/notifications')
		.get(function(req,res){
			getNotifications(req.query,function(error,data){
				res.send(data);
			});
		});

	app.route('/changeState')
		.put(function(req,res){
			updateNotifications(req.body,function(error,data){
				res.send(data);
			});
		});

	app.route('/Dashboard')
		.get(function(req,res){
			getPublicaciones(function(error,data){
				res.send(data);
			})
		})

	setInterval(function(){
 		getNotificacionesAdmin(function(error,data){
 			io.to('perfil').emit('notificacionAdmin',data)
		});
 	},1000)

//traer publicaciones al dashboard
	setInterval(function(){
 		getPublicacionAdmin(function(error,data){
 			io.to('perfil').emit('publicacion',data)

		});
 	},1000)
//agrear libros
 	setInterval(function(){
 		getLastBooks(function(error,data){
 			io.to('area').emit('libros',data)
 		})
 	},1000)


//prestar las reservas
 	setInterval(function(){
 		updateReservas(function(error,data){
 			io.to('perfil').emit('reservas',data)
 		})
 	},1000);


//penalizar usuario
 	setInterval(function(){
 		viewUsuario(function(error,data){

 			io.to('perfil').emit('penalizado',data)
 		})
 	},1000);




}

module.exports = discussController;
