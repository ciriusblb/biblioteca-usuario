(function(){
	"use strict";
	angular.module("booksApp")
		.controller("BookCtrl",BookCtrl);

		function BookCtrl($state,BookResource,$cookieStore,$filter,$scope,CarreraResource,socket){
		var me=this;
		me.buscador='';
		var pos =0;
		var auxLugar='';
		var usr = $cookieStore.get('usuario');
getBotons();

		me.comentario={
			id_comentario:0,
			codigo_libro:'',
			codigo_usuario:'',
			nombre_usuario:'',
			apellido_usuario:'',
			perfil_usuario:'',
			comentario_usuario:'',
			hora_comentada:''
			// tipo:'comentario'
		}
        socket.on('comentando', function(data){
        	if($state.params.Book==data.codigo_libro){
        		 me.lastComentario=JSON.parse( JSON.stringify( data ) );
			  me.comentarios.push(me.lastComentario);
        	}else{
        	}
        	// console.log($state.params.Book);
	   
        });

			function getBotons(){
				BookResource.get({codigo_libro:$state.params.Book,codigo_usuario:usr.codigo_usuario},function(data){
					console.log("bottones ",data);
						if(data[0].auxIdE){
							me.reservado=3;
						}else{
							if(data[0].auxRes){
									me.reservado=1;
							}else{
								if(data[0].auxPres){
									me.reservado=4;
								}else{
									if(data[0].cantidad_l<=0){
										me.reservado=2;
									}else{
										me.reservado=0;
									}
								}
							}
						}
						
						me.book=data[0];
						console.log(me.book);
					});
			}
		

		socket.on('notificacion2', function(data){
          for (var i = 0; i <data.length; i++) {
            if(data[i].codigo_usuario==usr.codigo_usuario){
            	console.log(data);
              // $scope.notificaciones.unshift(data[i]);
              // $scope.cantidad=$scope.cantidad+1;
              me.book.cantidad_l=me.book.cantidad_l+1;
              if($state.params.Book==data[i].codigo_libro){
              	me.reservado=0;
              }
              
            }
          }
     
        });
        socket.on('libro',function(data){

        	if($state.params.Book==data[0].codigo_libro){
        		me.book.cantidad_l=data[0].cantidad_l;
        		if(me.book.cantidad_l==0){
        			if(usr.codigo_usuario!=data[0].codigo_usuario){
        				me.reservado=2;
        			}
        		}
        	}
	      
	    })
        var prestar=false;
	    socket.on('libroEditado',function(data){
	    	if(data[0]!=null || data[0]!=undefined){
	    		if($state.params.Book==data[0].codigo_libro){
		    		if(me.book.editado!=data[0].editado){
		    			console.log("editar");
		    			getBotons();
		    			me.book=data[0];
		    		}else{
		    			if(data[0].auxPres!=null && prestar==false){
		    				console.log("prestado");
		    				getBotons();
		    				prestar=true;
		    			}
		    		}
		    	}
	    	}
	    	
	    })
		BookResource.query({codigo:$state.params.Book},function(data){
			var temp={};
			for (var i=0; i<data.length; i++){
	          	for (var j=0 ; j<data.length - 1; j++){
	               if (data[j].id_comentario > data[j+1].id_comentario){
	                    temp = data[j];
	                    data[j] = data[j+1];
	                    data[j+1] = temp;}
	          	}
			}
	       	me.comentarios=data;
	    });
		
		me.reserva={
			codigo_reserva:'',
			codigo_libro:'',
			codigo_usuario:'',
			fecha_actual:0,
			fecha_vencimiento:'',
			lugar_reserva:'sala',
			estado_reserva:'reservado'
			// tipo:'reserva'
		}
		me.state=1;
		me.cambiar = function(est){
			if(est==2){
				swal({
				  title: '<i>Alto</i> <u>Usuario</u>',
				  type: 'info',
				  html:
				    '<b>Solo</b>, ' +
				    'puedes reservar libros ' +
				    'para leerlos en sala',
				  showCloseButton: true,
				  // showCancelButton: true,
				  focusConfirm: false,
				  confirmButtonColor: '#009688',
  							cancelButtonColor: '#d33',
				  confirmButtonText:
				    '<i class="fa fa-thumbs-up"></i> Great!',
				  confirmButtonAriaLabel: 'Thumbs up, great!',
				  // cancelButtonText:
				  // '<i class="fa fa-thumbs-down"></i>',
				  // cancelButtonAriaLabel: 'Thumbs down',
				})
			}else{
				me.state=est;
			}
			
		}
		me.verLibro = function(cod){
			me.reserva.fecha_vencimiento = me.futureDate();
			CarreraResource.get({codigoUsr:usr.codigo_usuario},function(data){
				me.catidad_resevas = data[0].varCanti;
				if(data[0].varCodRe){
					var cadena = data[0].varCodRe,
				    subCadena = cadena.substring(2, 8);
				    subCadena = parseInt(subCadena)+1;
				    subCadena = String(subCadena);'39'
					while(subCadena.length<6){
						subCadena='0'+subCadena;
					}
					me.reserva.codigo_reserva='RE'+subCadena;
				}else{
					me.reserva.codigo_reserva='RE000001';
				}
				if(data[0].varLugar || me.book.cantidad_l==1){
					me.reserva.lugar_reserva='sala',
					me.state=2;
				}else{
					me.state=1;
				}

			});
			me.reserva.codigo_libro=cod;
			me.date=new Date();
		}
		me.reservar= function(){
			me.reserva.fecha_actual = $filter('date')(new Date(), "yyyy-MM-dd HH:mm:ss");
			
			me.reserva.fecha_vencimiento = me.futureDate();
			me.reserva.fecha_vencimiento = $filter('date')(me.reserva.fecha_vencimiento, "yyyy-MM-dd HH:mm:ss");
			me.reserva.codigo_usuario=$scope.usuario.codigo_usuario;
			CarreraResource.save(me.reserva,function(data){
				console.log("reservas ",data);
				// if(data[0].cantidad_l>=0){
					// me.book.cantidad_l=data[0].cantidad_l;
					CarreraResource.take({codigoRes:me.reserva.codigo_reserva},function(data){
						$scope.reservas.push(data[0]);
						swal(
						  'Reservado!',
						  'click al botón!',
						  'success'
						)	
						me.reservado=1;				
					})
				// }	
			});
		}
		me.enEspera = function(codigo_libro){
			console.log(codigo_libro);
			me.espera={
				id_espera:0,
				codigo_libro:codigo_libro,
				codigo_usuario:usr.codigo_usuario,
				estado:0
			}
			BookResource.save(me.espera,function(data){
				console.log(data);
				me.reservado=3;
			})
		}

		me.futureDate = function(){
			var dateFuture = new Date();

			var dayOfMonth = dateFuture.getDate();
			dateFuture.setDate(dayOfMonth +2);
			console.log(dateFuture);
			return dateFuture;
		}

		me.comentar=function(codigo_libro){

			me.comentario.codigo_usuario=$scope.usuario.codigo_usuario,
			me.comentario.nombre_usuario=$scope.usuario.nombre_usuario,
			me.comentario.apellido_usuario=$scope.usuario.apellido_usuario,
			me.comentario.perfil_usuario=$scope.usuario.perfil_usuario,


			me.comentario.codigo_libro=codigo_libro;
			me.comentario.hora_comentada=$filter('date')(new Date(),'d MMM, y h:mm');
			CarreraResource.send(me.comentario,function(data){
				me.comentario.comentario_usuario='';
			})

		}

	}
}());