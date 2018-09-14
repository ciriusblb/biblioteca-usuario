(function(){
	"use strict";
	angular.module("booksApp")
		.controller("dashboardCtrl",dashboardCtrl);

		function dashboardCtrl($location,$stateParams,$scope,DashboardResource,socket){
		var me=this;
		console.log(DashboardResource);
		DashboardResource.query(function(data){
            	$scope.cant=data.length;
			var temp={};
			for (var i=0; i<data.length; i++){
	          	for (var j=0 ; j<data.length - 1; j++){
	               if (data[j].id_publicacion < data[j+1].id_publicacion){
	                    temp = data[j];
	                    data[j] = data[j+1];
	                    data[j+1] = temp;
	                }
	          	}
			}
			for (var i = 0; i < data.length; i++) {
				if(data[i].id_publicacion%2==0){
					data[i].class='notificacion';
				}else{
					data[i].class='timeline-inverted';
				}
			}
			console.log(data);
			$scope.dashboard = data;
		})
		socket.on('publicacion',function(data){
			if(data!=null || data != undefined){
				if(data.id_publicacion!=$scope.dashboard[0].id_publicacion){
							if(data.id_publicacion%2==0){
								data.class='notificacion';
							}else{
								data.class='timeline-inverted';
							}
							$scope.dashboard.unshift(data);
							// socket.emit('publicacionCant',$scope.dashboard.length);
							$scope.cant = $scope.dashboard.length;
						}
			}
			
		})


	}
}());