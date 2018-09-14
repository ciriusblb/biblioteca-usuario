(function(){
	"use strict";
	angular.module('common.services')
	  	.factory('BookResource',BookResource);
	  
	function BookResource($resource)
	{
		return $resource('/Book/:id',{idBricks:'@id'}, { 
			'get':    {method:'GET',isArray:true,url:'/getBook'},
			'query': { method: 'GET',isArray:true},
            'update': { method: 'PUT'},
	        'save': { method: 'POST',url:'/waitBook'},
	        'remove': { method:'DELETE'}
		});
	};

}());
