(function(){
	"use strict";
	angular.module('common.services')
	  	.factory('LoginResource',LoginResource);
	  
	function LoginResource($resource)
	{
			return $resource('/BooksApp/:id',{idBricks:'@id'}, { 
			'get': {method:'GET',url:'/contrasenia'},
			'check': {method:'GET',url:'/email'},
			'codi': {method:'GET',url:'/codigo'},

			'query': { method: 'GET',url:'/iniciar'},
	        'save': { method: 'POST',url:'/registrar'},
	        'email': {method: 'GET'}
		});
	};

}());
