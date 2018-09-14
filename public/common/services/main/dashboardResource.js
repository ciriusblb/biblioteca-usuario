(function(){
	"use strict";
	angular.module('common.services')
	  	.factory('DashboardResource',DashboardResource);
	  
	function DashboardResource($resource)
	{
		return $resource('/Dashboard/:id',{idBricks:'@id'}, { 
			'get':    {method:'GET'},
			'query': { method: 'GET',isArray:true},
            'update': { method: 'PUT'},
	        'save': { method: 'POST'},
	        'remove': { method:'DELETE'}
		});
	};

}());
