(function(){
	"use strict";
	angular.module('common.services')
	  	.factory('CarreraResource',CarreraResource);
	  
	function CarreraResource($resource)
	{
		return $resource('/Carrera/:id',{idBricks:'@id'}, { 
			'get':    {method:'GET',isArray:true,url:'/getCod'},
			'take':    {method:'GET',isArray:true,url:'/getLastBook'},
			'query': { method: 'GET',isArray:true},
            'update': { method: 'PUT',url:'/'},
	        'save': { method: 'POST',isArray:true,url:'/reservar'},
	        'send': { method: 'POST',url:'/comentar'},
	        'remove': { method:'DELETE'}
		});
	};

}());
