(function(){
	"use strict";
	angular.module("booksApp")
		.controller("FatherCtrl",FatherCtrl);
	function FatherCtrl($scope,$cookieStore,$state){
    
		var me = this;
    // $scope.userConectado={
    //    	nombre:"",
    //    	apellido:"",
    //    	conectado:""
    // };
    $cookieStore.remove('usuarios')
    if($cookieStore.get('usuarios') == undefined){
      var usuarios = [];$cookieStore.put('usuarios',usuarios);
    }
  
    
    var usr = $cookieStore.get('usuario');
    console.log($cookieStore.get('usuarios'));
    
    // if (usr != null) {
    //   $scope.userConectado.nombre = usr.nombre_usuario;
    //   $scope.userConectado.apellido = usr.apellido_usuario;
    //   $scope.userConectado.conectado = true;
    // };

	}
}());
