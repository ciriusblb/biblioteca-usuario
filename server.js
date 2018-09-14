'use strict';
var express = require('express'),
	http = require("http"),
    server = express(),
    swig = require('swig'),
    bodyParser=require('body-parser'),
    formidable= require('express-form-data');
    



var app = http.createServer(server).listen(8000);
var io = require("socket.io").listen(app);


server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(formidable.parse({keepExtensions:true}));

// socket.io demo



require('./apps/main/controller')(server,io);

require('./apps/user/controller')(server);

//Templates
server.engine('html',swig.renderFile);
server.set('view engine','html');
swig.setDefaults({cache:false});
//fin de templates

// //Archivos estaticos
server.use(express.static(__dirname+'/public'));
server.get('/', function (req, res) {
  res.render('index');
});
	
console.log("app escuchando por el puerto 8000");



