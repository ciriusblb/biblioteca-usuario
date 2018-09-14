'use strict';
var express= require('express'),
	userRegister = require('./model').userRegister,
	userSesion = require('./model').userSesion,
	sendEmail = require('./emailCtrl'),
	checkEmail = require('./model').checkEmail,
	checkCodigo = require('./model').checkCodigo;




var userController = function(server){


	server.route('/registrar')
	 	.post(function(req,res){
	 		userRegister(req.body,function(error,data){
	 			res.send(data);
	 		})
	 	});
	server.route('/iniciar')
	 	.get(function(req,res){
	 		userSesion(req.query,function(error,data){
	 			res.json(data);
	 		})
	 	});

	server.route('/contrasenia')
		.get(function(req,res){
			sendEmail(req.query,function(error,data){
				res.send(data);
			})
		})

	server.route('/email')
		.get(function(req,res){
			checkEmail(req.query,function(error,data){
				res.send(data);
			})
		})
	server.route('/codigo')
		.get(function(req,res){
			checkCodigo(req.query,function(error,data){
				res.send(data);
			})
		})
}

	


module.exports = userController;