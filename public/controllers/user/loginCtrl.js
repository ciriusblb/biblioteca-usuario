(function(){
	"use strict";
	angular.module("booksApp")
		.controller("LoginCtrl",LoginCtrl);

		function LoginCtrl($state,LoginResource,$scope,$q,$log,$cookieStore,$filter){
		var me=this;
		var suport=undefined;
		me.escuelas = [
		{escuela:'ADMINISTRACIÓN Y NEGOCIOS INTERNACIONALES'},
		{escuela:'CONTABILIDAD Y FINANZAS'},
		{escuela:'DERECHO Y CIENCIAS POLÍTICAS'},
		{escuela:'ECOTURISMO'},
		{escuela:'EDUCACIÓN: MATEMÁTICAS Y COMPUTACIÓN'},
		{escuela:'EDUCACIÓN INICIAL Y ESPECIAL'},
		{escuela:'EDUCACIÓN PRIMARIA E INFORMÁTICA'},
		{escuela:'ENFERMERÍA'},
		{escuela:'INGENIERÍA AGROINDUSTRIAL'},
		{escuela:'INGENIERÍA DE SISTEMAS E INFORMÁTICA'},
		{escuela:'INGENIERÍA FORESTAL Y MEDIO AMBIENTE'},
		{escuela:'MEDICINA VETERINARIA Y ZOOTECNIA'}
		];
// holaaaaaaaaaaaaaaaaaaaaaaaaaaaa
		var iniciarSesion = $q.defer();
		iniciarSesion.promise.then(userASesion);
		function userASesion(user){
			$cookieStore.put("estaConectado",true);

			$cookieStore.put("usuario",user);
			$state.go("home.perfil");
		};
		me.fecha =$filter('date')(new Date(), 'd MMM y');
// holaaaaaaaaaaaaaaaaaaaaaaaaaaaa


		me.sesion={
			codigo: '15121041',
			contrasena: 'El6-mejo'
		}

// holaaaaaaaaaaaaaaaaaaaaaaaaaaaa

		me.iniciar = function(){
				
				LoginResource.query({codigo:me.sesion.codigo, contrasena:me.sesion.contrasena},function(data){
					console.log(data);
					if (data.nombre_usuario) {
						iniciarSesion.resolve(data)
					}else{
						if(data.penalizado){
							swal({
								confirmButtonColor: '#009688',
			  					cancelButtonColor: '#d33',
								title:'Ah ah...',
								html:'¡Usted esta cumpliendo una pena señorsh!',
								type:'info'
							})
						}else{
							swal({
								confirmButtonColor: '#009688',
			  					cancelButtonColor: '#d33',
								title:'Oops...',
								html:'¡El usuario y/o contraseña es incorrecto!',
								type:'error'
							})
						}
						
					}
				});

		}
// holaaaaaaaaaaaaaaaaaaaaaaaaaaaa


		me.formulario={
			codigo:'',
			nombre:'',
			apellido:'',
			escuela:'ADMINISTRACIÓN Y NEGOCIOS INTERNACIONALES',
			DNI:'',
			correo:'',
			contrasena:'',
			perfil:'profile.jpg',
			direccion:''
		}
		me.Capitalletter=function(string,num){
			if(string){
				switch(num){
					case 1: me.formulario.nombre= string.charAt(0).toUpperCase() + string.slice(1); break;
					case 2: me.formulario.apellido= string.charAt(0).toUpperCase() + string.slice(1); break;
				};
			}
		};
		me.registrar= function(){
			console.log(me.emailValue, me.codigoValue);
			if(me.emailValue==false || me.codigoValue==false){
				swal({
					confirmButtonColor: '#009688',
  					cancelButtonColor: '#d33',
					title:'Oops...',
					html:'¡Corrija los errores!',
					type:'error'
				})
			}else{
				console.log("corecto");
				LoginResource.get({email: me.formulario.correo})
		            .$promise.then(function(code){
		            	swal({
							title: 'Ingrese código de validacion',
							text:'Luego revise su correo electrónico',
							input: 'text',
							showCancelButton: true,
							confirmButtonColor: '#009688',
  							cancelButtonColor: '#d33',
							confirmButtonText: 'Submit',
							showLoaderOnConfirm: true,
							preConfirm: function (text) {
							    return new Promise(function (resolve, reject) {
							      	setTimeout(function() {
							      	var txt = code.text.replace(/\D/g,'');
									console.log(txt);
							        if (text === txt) {
						                LoginResource.save(me.formulario,function(data){
											console.log(data);
										})
							          	resolve()
							        } else {
							          	reject("Código de validación incorrecto");
							        }
							      }, 2000)
							    })
						  	},
						allowOutsideClick: false
						}).then(function (text) {
							swal({
							    type: 'success',
							    title: '¡Bienvenido! ya vuelta',
							    html: 'Usuario ' + me.formulario.nombre
							})
							$('.container').stop().removeClass('active');
						},function (dismiss) {
						  	if (dismiss === 'cancel') {
							    swal(
							      	'Cancelled',
							      	'Tu vida imaginaria esta a salvo :)',
							      	'error'
							    )
						 	}
						})
		        });
			}
			
		}
		me.selectEscuela = function(idx){
			me.formulario.escuela = me.escuelas[idx].escuela;
		}
		var hola = 'ciriusblb@gmail.com';
		me.Email = function(){
			if(me.formulario.correo){
				LoginResource.check({email: me.formulario.correo},function(data){
			 		console.log(data.correo_usuario);
						if(data.correo_usuario == me.formulario.correo){
							me.emailValue=false;
							$('#email').attr("data-content", "El correo electrónico "+data.correo_usuario+" ya existe"); $('#email').popover("show");
						}else{
							$('#email').popover('destroy');
							me.emailValue=true;
						}
			 	})
			}	
    	};

    	me.codigo = function(){
    		if(me.formulario.codigo){
    			if(me.formulario.codigo.length>=8){
					LoginResource.codi({codigo: me.formulario.codigo},function(data){
				 		console.log(data.codigo_usuario);
							if(data.codigo_usuario == me.formulario.codigo){
								me.codigoValue=false;
								$('#codigo').attr("data-content", "El Código de estudiante "+data.codigo_usuario+" ya existe"); $('#codigo').popover("show");
							}
				 	})
				}else{
					me.codigoValue=true;
					$('#codigo').popover('destroy');
				}	
    		}
			
    	};

		me.contrasenia = function(){
			swal({
				  title: 'Ingrese su Correo electrónico',
				  text:'Enviaremos un codigo de validación para recuperar su contraseña',
				  input: 'email',
				  showCancelButton: true,
				  confirmButtonColor: '#009688',
  				  cancelButtonColor: '#d33',
				  confirmButtonText: 'Submit',
				  showLoaderOnConfirm: true,
				  preConfirm: function() {
				    return new Promise(function(resolve) {
				      setTimeout(function() {
				        resolve();
				      }, 2000);
				    });
				  },
				  allowOutsideClick: false
				}).then(function(email) {
				  	if (email) {
					    LoginResource.get({email:email},function(data){
					    	console.log(data);
					    	swal({
								title: 'Ingrese código de validacion',
								input: 'text',
								showCancelButton: true,
								confirmButtonColor: '#009688',
  								cancelButtonColor: '#d33',
								confirmButtonText: 'Submit',
								showLoaderOnConfirm: true,
								preConfirm: function (text) {
								    return new Promise(function (resolve, reject) {
								      	setTimeout(function() {
										var txt = data.text.replace(/\D/g,'');
										console.log(txt);
								        if (text === txt) {
								          	resolve()
								        } else {
								          	reject("Código devalidación incorrecto");
								        }
								      }, 2000)
								    })
							  	},
							allowOutsideClick: false
							}).then(function (text) {
								LoginResource.get({email:email,password:true},function(data){
									console.log(data.text);
									suport = data.text.replace(/\D/g,'');
								})
								swal({
								    type: 'success',
								    confirmButtonColor: '#009688',
  									cancelButtonColor: '#d33',
								    title: '¡Bienvenido de vuelta ya vuelta!',
								    html: 'revise su correo electrónico '
								})
							},function (dismiss) {
							  	if (dismiss === 'cancel') {
								    swal(
								      	'Cancelado',
								      	'Tu vida imaginaria está a salvo :)',
								      	'error'
								    )
							 	}
							})
						});
				  	}
				})
		}
	}
}());