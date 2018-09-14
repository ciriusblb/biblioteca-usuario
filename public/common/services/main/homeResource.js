(function(){
	"use strict";
	angular.module('common.services')
	  	.factory('HomeResource',HomeResource);
	  
	function HomeResource($resource)
	{
		return $resource('/BooksApp/:id',{idBricks:'@id'}, { 
			'get':    {method:'GET',url:'/getUser'},
			'pass':    {method:'GET',url:'/sendPass'},
			'query': { method: 'GET',isArray:true},
			'call': { method: 'GET',isArray:true,url:'/reservas'},
			'waits': { method: 'GET',isArray:true,url:'/callWait'},
			'note': { method: 'GET',isArray:true,url:'/notifications'},
			'dash': { method: 'GET',isArray:true,url:'/Dashboard'},
            'update': { method: 'PUT',url:'/upload'},
	        'save': { method: 'POST',url:'/postergar'},
	        'remove': { method:'DELETE',url:'/cancel'},
	        'change':{method:'PUT',url:'/change'},
            'state': { method: 'PUT',url:'/changeState'}


		});
	};

}());
