'use strict';
var mysql = require('../../config/mysql');
// var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var algorithm = 'aes-256-ctr';
var password = 'd6F3Efeq';
 
var connection=mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: '',
   database: 'library',
   port: 3306
});



var dataModels ={};
dataModels.userRegister =function(data,callback){
    if(connection){	

		var cipher = crypto.createCipher(algorithm, password)
 		var crypted = cipher.update(data.contrasena, 'utf8', 'hex')
  		crypted += cipher.final('hex');
		var sql = 'INSERT INTO usuarios(codigo_usuario,nombre_usuario,apellido_usuario,escuela_usuario,DNI_usuario,correo_usuario,contrasena_usuario,perfil_usuario,direccion_usuario) VALUES('+
		connection.escape(data.codigo)+','+
		connection.escape(data.nombre)+','+
		connection.escape(data.apellido)+','+
		connection.escape(data.escuela)+','+
		connection.escape(data.DNI)+','+
		connection.escape(data.correo)+','+
		connection.escape(crypted)+','+
		connection.escape(data.perfil)+','+
		connection.escape(data.direccion)+')';
		connection.query(sql, function(error, row) {
			if(error){
				throw error;
			}else{
				var sql ='INSERT INTO estado_u(codigo_usuario,cantidad_reservas,estado_reserva,estado_prestado,penalizado) VALUES('+
				connection.escape(data.codigo)+','+
				connection.escape(0)+','+
				connection.escape('no reservado')+','+
				connection.escape('no prestado')+','+
				connection.escape('Libre')+')';
				connection.query(sql, function(error, row) {
					if(error){
						throw error;
					}else{	
						callback(null,{msg:'Registrado'});
					}
				});
			}
		});

	}
};
dataModels.userSesion =function(data,callback){
    if(connection)
	{	
		var sql ='SELECT * FROM usuarios WHERE codigo_usuario='+connection.escape(data.codigo)+'';
		connection.query(sql, function(error, row) 
		{
			if(error)
			{
				throw error;
			}
			else
			{	
				if(row[0]){
					var decipher = crypto.createDecipher(algorithm, password)
				 	var decrypted = decipher.update(row[0].contrasena_usuario, 'hex', 'utf8')
				  	decrypted += decipher.final('utf8');
				  	if(decrypted == data.contrasena){
				  		var usuario = row[0];
				  		console.log(row[0].codigo_usuario);
				  		var sql = 'select penalizado from estado_u where codigo_usuario = '+connection.escape(row[0].codigo_usuario)+'';
				  		connection.query(sql,function(error,row){
				  			if(error) throw error;
				  			else{
				  				console.log("row ",row[0].penalizado);
				  				if(row[0].penalizado=='Libre'){
				  					callback(null,usuario);
				  				}else{
				  					console.log(row);
				  					callback(null,row[0]);
				  				}
				  			}
				  		})
				  		
				  	}else{
				  		console.log("1");
				  		callback(null,undefined);
				  	}
				}else {
					console.log("2");callback(null,undefined);}
			}
		});

	}
};

dataModels.recoverPassword = function(data,callback){
	if(connection){
		var sql = 'SELECT * FROM usuarios WHERE correo_usuario ='+connection.escape(data.email)+'';
		connection.query(sql,function(error,row){
			if(error) {throw error;}
			else {
				if(row[0]){
					var decipher = crypto.createDecipher(algorithm, password)
				 	var decrypted = decipher.update(row[0].contrasena_usuario, 'hex', 'utf8')
				  	decrypted += decipher.final('utf8');
				  	callback(null,{contrasena:decrypted});
				}else callback(null,undefined);
			}
		});
	}
};
dataModels.checkEmail = function(data,callback){
	if(connection){
		var sql = 'SELECT correo_usuario from usuarios where correo_usuario='+connection.escape(data.email)+'';
		connection.query(sql, function(error, row) 
		{
			if(error)
			{
				throw error;
			}
			else
			{
				callback(null, row[0]);
			}
		});
	}
}
dataModels.checkCodigo = function(data,callback){
	if(connection){
		var sql = 'SELECT codigo_usuario from usuarios where codigo_usuario='+connection.escape(data.codigo)+'';
		connection.query(sql, function(error, row) 
		{
			if(error)
			{
				throw error;
			}
			else
			{
				callback(null, row[0]);
			}
		});
	}
}


module.exports =dataModels;