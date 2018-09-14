(function(){
	"use strict";
	angular.module("booksApp")
		.controller("CarreraCtrl",CarreraCtrl);

		function CarreraCtrl($state,CarreraResource,$cookieStore,$filter,$scope,socket){
		var me=this;
		me.areas=['Medicina_Veterinaria','Matematica','Administracion','Obras_Literarias','Computacion_e_Informatica','Ciencias_Politicas','Sociologia','Economia','Fisica','Agronomia_y_Forestal','Quimica','Contabilidad','Biologia','Ingenierias','Estadistica','Enfermeria','Historia','Turismo_y_Hoteleria','Medicina','Geografia'];
		for (var i = 0; i < me.areas.length; i++) {
			if($state.params.Area!=me.areas[i]){
				$state.go('home.libro',{Book:$state.params.Area});
				// break;
			}else{
				$state.go('home.area',{Area:$state.params.Area});
				CarreraResource.query({ruta:$state.params.Area},function(data){
				me.libros=data;
	            for (var i = 0; i < $scope.areas.length; i++) {
	               if($scope.areas[i].ruta_area==$state.params.Area){
	                $scope.hola=$scope.areas[i].nombre_area;
	                me.area_00=$scope.areas[i].codigo_area;
	               }
	            }
			});
				break;
			}
		}
		socket.on('libros',function(data){
			if(data.ruta_area === $state.params.Area){
				if(me.libros.length==0){
					me.libros.push(data);
				}else{
					if(me.libros[me.libros.length-1].id_libro != data.id_libro || me.libros.length==0){
						me.libros.push(data);
					}
				}		
			}
		})

		socket.on('librosEliminados',function(data){
			if(data.length==0){
				me.libros=data;
			}else{
				if(data[0].area_l==me.area_00){
					if(me.libros.length>data.length){
						me.libros=data;
					}
				}
			}
			
		})
		me.hola= function(){
			console.log("asdas");
		}
		

	}
}());