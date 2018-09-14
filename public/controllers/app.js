(function(){
	"use strict";

	
	var app = angular.module("booksApp",["ui.router","common.services","ngMessages","ngCookies","ui.mask","ngIdle","ui.bootstrap"]);






	app.run(function ($location,$state, $rootScope, $cookieStore) {
		$rootScope.$on('$locationChangeStart', function(event,next, fromUrl) {
			if($cookieStore.get("estaConectado")==false || $cookieStore.get("estaConectado")==undefined){
				// if(next=='http://localhost:8000/#!/BooksApp/home/perfil' || next=='http://localhost:8000/#!/BooksApp/home/notificaciones' || next =='http://localhost:8000/#!'+$location.$$path){

				if(next=='http://localhost:8000/#!/BooksApp/home/perfil' || next=='http://localhost:8000/#!/BooksApp/home/notificaciones'){
	    			$location.path('/BooksApp/presentacion');
	    		}
	    	}else{
	    		if(next=='http://localhost:8000/#!/BooksApp/login' || next=='http://localhost:8000/#!/BooksApp/presentacion'){
	    			$location.path('/BooksApp/home/perfil');
	    		}
	    	}
		});
	});




	
	app.config(function($stateProvider,$urlRouterProvider,$httpProvider,KeepaliveProvider, IdleProvider){
		$urlRouterProvider.otherwise('/BooksApp/presentacion');

		IdleProvider.idle(600);
		IdleProvider.timeout(5);
		KeepaliveProvider.interval(10);

		$stateProvider
		   	.state('BooksApp',{
		   		abstract:true,
			   	url: '/BooksApp',
			   	templateUrl:'/views/user/index.html',
			   	controller:'LoginCtrl as vm'
		   	})
		   	.state('BooksApp.login',{
			   	url: '/login',
			   	templateUrl:'/views/user/sesion.html'
		   	})
		   	.state('BooksApp.presentacion',{
		   		url: '/presentacion',
			   	templateUrl:'/views/user/presentacion.html'
		   	})
		    .state('home',{
		    	abstract:true,
		   	 	url: '/BooksApp/home',
		   	 	templateUrl:'/views/main/home.html',
		   	 	controller:'PerfilCtrl as vc'
		   	})
		   	.state('home.perfil',{
		   	 	url: '/perfil',
		   	 	templateUrl:'/views/main/home/perfil.html'
		   	})
		   	.state('home.dashboard',{
		   	 	url: '/dashboard',
		   	 	templateUrl:'/views/main/home/dashboard.html'
		   	 	// controller:'dashboardCtrl as vm'
		   	})
		   	.state('home.area',{
		   	 	url: '/:Area',
		   	 	templateUrl:'/views/main/home/carreraBook.html',
		   	 	controller:'CarreraCtrl as vm'
		   	})
		   	.state('home.libro',{
		   	 	url: '/:Book',
		   	 	templateUrl:'/views/main/home/book.html',
		   	 	controller:'BookCtrl as vm'
		   	})
		   	$httpProvider.defaults.transformRequest = function(data) {
		    if(undefined === data) return data;
		    
		    var formData = new FormData();
		    angular.forEach(data, function(value, key) {
		      if(value instanceof FileList) {
		        if(value.length === 1)
		          formData.append(key, value[0]);
		        else {
		          angular.foreach(value, function(file, index) {
		            formData.append(key + '_' + index, file);
		          });
		        }
		      } else {
		        formData.append(key, value);
		      }
		    });
		    return formData;
		  };
		  $httpProvider.defaults.headers.post['Content-Type'] = undefined;
		  $httpProvider.defaults.headers.common['Content-Type'] = undefined;
		  $httpProvider.defaults.headers.put['Content-Type'] = undefined;

	});


}());