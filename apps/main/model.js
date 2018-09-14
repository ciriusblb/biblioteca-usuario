'use strict';
var mysql = require('../../config/mysql');
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
dataModels.getUsuario =function(data,callback){
    if(connection)
	{
		var sql ='SELECT * FROM usuarios where codigo_usuario='+connection.escape(data.codigo)+'';
		connection.query(sql, function(error, row) 
		{
			if(error)
			{
				throw error;
			}
			else
			{
				callback(null,row[0]);
			}
		});
	}
};
dataModels.getAreas =function(callback){
    if(connection)
	{
		var sql ='SELECT * FROM areas';
		connection.query(sql, function(error, row) 
		{
			if(error)
			{
				throw error;
			}
			else
			{
				callback(null,row);
			}
		});
	}
};
dataModels.getReservas =function(data,callback){
    if(connection)
	{
		var sql ='CALL spVerReservas('+connection.escape(data.codigo)+')';
		connection.query(sql, function(error, row) 
		{
			if(error)
			{
				throw error;
			}
			else
			{
				callback(null,row[0])
			}
		});
	}
};
dataModels.uploadUsuario=function(data,callback){
	if(connection)
	{	
		var sql = 'UPDATE usuarios SET perfil_usuario='+connection.escape(data.file)+' WHERE codigo_usuario= '+connection.escape(data.codigo)+'';
		connection.query(sql, function(error, row) 
		{
			if(error)
			{
				throw error;
			}
			else
			{	
				callback(null, {url:data.file});
			}
		});

	}
};
dataModels.editUsuario=function(data,callback){
	if(connection)
	{	
		var sql = 'UPDATE usuarios SET nombre_usuario='+connection.escape(data.nombre_usuario)+
		',apellido_usuario='+connection.escape(data.apellido_usuario)+
		',apellido_usuario='+connection.escape(data.apellido_usuario)+
		',direccion_usuario='+connection.escape(data.direccion_usuario)+
		',DNI_usuario='+connection.escape(data.DNI_usuario)+
		' WHERE codigo_usuario= '+connection.escape(data.codigo_usuario)+'';
		connection.query(sql, function(error, row) 
		{
			if(error)
			{
				throw error;
			}
			else
			{	
				callback(null, 'editado');
			}
		});

	}
};
dataModels.postponeFecha = function(data,callback){
	if(connection){
		var sql = 'UPDATE reservas set fecha_limite = '+connection.escape(data.fecha_limite)+' where codigo_reserva = '+connection.escape(data.codigo_reserva)+'';
		connection.query(sql,function(error,row){
			if(error) throw error;
			else callback(null,{msg:'pospuesto'});
		});
	}
};
dataModels.getCarrera =function(data,callback){
    if(connection)
	{	
		var sql ='SELECT codigo_area FROM areas where ruta_area = '+connection.escape(data.ruta)+'';
		connection.query(sql, function(error, row) 
		{
			if(error)
			{
				throw error;
			}
			else
			{ 
				var sql ='SELECT * FROM libros where area_l = '+connection.escape(row[0].codigo_area)+'';
				connection.query(sql, function(error, row) 
				{
					if(error)
					{
						throw error;
					}
					else
					{
						callback(null, row);
					}
				});
			}
		});
	}
};
dataModels.getCodigo =function(data,callback){
    if(connection)
	{

		var sql ='CALL selectCod_reserva('+connection.escape(data.codigoUsr)+')';
		connection.query(sql, function(error, row) 
		{
			if(error)
			{
				throw error;
			}
			else
			{
				callback(null,row[0]);
			}
		});
	}
};
dataModels.getLastBook =function(data,callback){
    if(connection)
	{

		var sql ='CALL spLastReserva('+connection.escape(data.codigoRes)+')';
		connection.query(sql, function(error, row) 
		{
			if(error)
			{
				throw error;
			}
			else
			{
				callback(null,row[0]);
			}
		});
	}
};

dataModels.saveReserva =function(data,callback){
    if(connection)
	{	
		var sql ='CALL spReservar('+connection.escape(data.codigo_reserva)+','+connection.escape(data.codigo_libro)+','+connection.escape(data.codigo_usuario)+','+connection.escape(data.fecha_actual)+','+connection.escape(data.fecha_vencimiento)+','+connection.escape(data.lugar_reserva)+')';
		connection.query(sql, function(error, row) 
		{
			if(error)
			{
				throw error;
			}
			else
			{ 	
				var datos = row[0];
				callback(null,datos);
			}
		});
	}
};

dataModels.cancelReserva =function(data,callback){
    if(connection)
	{
		var sql='CALL spCancelReserva('+connection.escape(data.id)+')';
		connection.query(sql,function(error,row){
			if(error){
				throw error;
			}else{
				callback(null,{msg:'reserva cancelada'});
			}
		})	
	}
};

dataModels.getComentarios=function(data,callback){
	if(connection){
		var sql = 'select comentarios.*,usuarios.nombre_usuario,usuarios.apellido_usuario,usuarios.perfil_usuario from comentarios,usuarios where comentarios.codigo_libro = '+connection.escape(data.codigo)+' and usuarios.codigo_usuario=comentarios.codigo_usuario';
		// var sql = 'SELECT * from comentarios where codigo_libro='+connection.escape(data.codigo)+'';
		connection.query(sql,function(error,row){
			if(error){
				throw error;
			}else{
				callback(null,row);
			}
		})
	}
}

dataModels.sendComentario=function(data,callback){
	if(connection){
		var sql = 'insert into comentarios(codigo_libro,codigo_usuario,comentario_usuario,hora_comentada) values('+connection.escape(data.codigo_libro)+
		','+connection.escape(data.codigo_usuario)+
		','+connection.escape(data.comentario_usuario)+
		','+connection.escape(data.hora_comentada)+')';
		connection.query(sql,function(error,row){
			if(error){
				throw error;
			}else{
				callback(null,{msg:'comentado'});
			}
		})
	}
}

dataModels.getBook=function(data,callback){
	if(connection){
		var sql = 'CALL spGetBook('+connection.escape(data.codigo_libro)+','+connection.escape(data.codigo_usuario)+')';
		connection.query(sql,function(error,row){
			if(error) throw error;
			else {
				callback(null,row[0]);
			}
		})
	}
}
dataModels.getAuthorization = function(data,callback){
	if(connection){
		var sql ='SELECT * FROM usuarios WHERE codigo_usuario='+connection.escape(data.codigo_usuario)+'';
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
				  	if(decrypted == data.contrasena_usuario){
				  		callback(null,row[0]);
				  	}else{
				  		callback(null,undefined);
				  	}
				}else callback(null,undefined);
			}
		});
	}
}


dataModels.changePassword = function(data,callback){
	if(connection){
		var cipher = crypto.createCipher(algorithm, password)
 		var crypted = cipher.update(data.contrasena_usuario, 'utf8', 'hex')
  		crypted += cipher.final('hex');		
  		var sql = 'insert INTO antiguas_contrasenas(codigo_usuario,contrasena_usuario) values('+
		connection.escape(data.codigo_usuario)+','+connection.escape(crypted)+')';
		connection.query(sql,function(error,row){
			if(error) throw error;
			else{
				var cipher = crypto.createCipher(algorithm, password)
 				var crypted = cipher.update(data.password1, 'utf8', 'hex')
  				crypted += cipher.final('hex');
				var sql = 'update usuarios set contrasena_usuario = '+connection.escape(crypted)+' where codigo_usuario = '+
				connection.escape(data.codigo_usuario)+'';
				connection.query(sql,function(error,row){
					if(error) throw error;
					else callback(null,{msg:'cambiado'});
				})
			}
		})
	}
}
dataModels.waitBook = function(data,callback){
	if(connection){
		var sql = 'insert into esperas(codigo_libro,codigo_usuario,estado) values('+connection.escape(data.codigo_libro)
		+','+connection.escape(data.codigo_usuario)+','+connection.escape(data.estado)+')';
		connection.query(sql,function(error,row){
			if(error) throw error;
			else callback(null,{msg:'en espera'});
		})
	}
}
dataModels.updateReserva = function(data,callback){
	if(connection){
		var sql = 'SELECT * from reservas where codigo_usuario='+connection.escape(data.codigo_usuario)+'';
		connection.query(sql,function(error,row){
			if(error) throw error;
			else callback(null,row);
		})
	}
}
dataModels.waitingRoom = function(data,callback){
	if(connection){
		var sql ='SELECT * from esperas where codigo_libro = '+connection.escape(data.codLibro)+'';
		connection.query(sql,function(error,row){
			if (error) { throw error}
			else{
				var notificaciones =[];
				if(row.length>0){
					console.log("entro");
					var i =0;
					var getNot = setInterval(function(){
							notificaciones[i]={};
							var sql = 'call spInsertNotificacion('+connection.escape(row[i].codigo_usuario)+','+connection.escape(row[i].codigo_libro)+')';
							connection.query(sql,function(error,row2){
								if(error) throw error;
								else{
									notificaciones[i]=row2[0][0];
									i++;
									if(i==row.length){
										console.log("in ",notificaciones);
										callback(null,notificaciones);
										clearTimeout(getNot)
									}
								}
							})	
					},1000)

				}else{
					console.log("no entro");
					callback(null,notificaciones);
				}
				
			}
		})
	}
	
}
dataModels.getWaitRoom = function(data,callback){
	if(connection){
		var sql ='SELECT * from esperas where codigo_usuario = '+connection.escape(data.codigo)+'';
		connection.query(sql,function(error,row){
			if (error) { throw error}
			else{
				callback(null,row);
			}
		})
	}
}
dataModels.getNotifications = function(data,callback){
	if(connection){
		var sql ='SELECT notificaciones.*,libros.area_l,libros.portada_l from notificaciones,libros where notificaciones.codigo_usuario = '+connection.escape(data.codigo)+' and notificaciones.codigo_libro=libros.codigo_libro';
		connection.query(sql,function(error,row){
			if (error) { throw error}
			else{
				callback(null,row);
			}
		})
	}
}
dataModels.updateNotifications = function(data,callback){
	if(connection){
		var sql ='UPDATE notificaciones set estado = 1 where id_notificacion = '+connection.escape(data.id_notificacion)+'';
		connection.query(sql,function(error,row){
			if (error) { throw error}
			else{
				callback(null,{msg:'cambiado'});
			}
		})
	}
}
dataModels.getNotificacionesAdmin = function(callback){
	if(connection){
		var sql = 'call spNotificar()';
		connection.query(sql,function(error,row){
			if(error) throw error;
			else{
				callback(null,row[0]);
			}
		})
	}
}
dataModels.getPublicaciones=function(callback){
	if(connection){
		var sql = 'select * from publicaciones';
		connection.query(sql,function(error,row){
			if(error) throw error;
			else{
				callback(null,row);
			}
		})
	}
}
dataModels.getPublicacionAdmin=function(callback){
	if(connection){
		var sql = 'CALL spGetPublicacion()';
		connection.query(sql,function(error,row){
			if(error) throw error;
			else{
				callback(null,row[0][0]);
			}
		})
	}
}
dataModels.getLastBooks= function(callback){
	if(connection){
		var sql = 'call spGetLastBooks()';
		connection.query(sql,function(error,row){
			if(error) throw error;
			else callback(null,row[0][0]);
		})
	}
}
dataModels.updateReservas = function(callback){
	if(connection){
		var sql = 'call spUpdateReservas()';
		connection.query(sql,function(error,row){
			if(error) throw error;
			else callback(null,row[0]);
		})
	}
}

dataModels.viewUsuario = function(callback){
	if(connection){
		var sql = 'select codigo_usuario,penalizado from estado_u where penalizado = "Penalizado"';
		connection.query(sql,function(error,row){
			if(error) throw error;
			else callback(null,row);
		})
	}
}
module.exports =dataModels;