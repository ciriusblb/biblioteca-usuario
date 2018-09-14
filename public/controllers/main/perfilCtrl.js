
(function(){
	"use strict";
	angular.module("booksApp")
		.controller("PerfilCtrl",PerfilCtrl);
	function PerfilCtrl($state,HomeResource,socket, $scope,$interval,$cookieStore,$filter,Idle,$uibModal){
      var me = this;

      function closeModals() {
        if ($scope.warning) {
          $scope.warning.close();
          $scope.warning = null;
        }
        if ($scope.timedout) {
          $scope.timedout.close();
          $scope.timedout = null;
        }
      }
      // swal({
      //   title: 'Auto close alert!',
      //   text: 'I will close in 5 seconds.',
      //   timer: 5000,
      //   onOpen: () => {
      //     swal.showLoading()
      //   }
      // })

      $scope.$on('IdleStart', function() {
        closeModals();
        $scope.warning = $uibModal.open({
          templateUrl: 'warning-dialog.html',
          windowClass: 'modal-warning'
        });
      });

      $scope.$on('IdleEnd', function() {
        closeModals();
        $scope.start();
      });

      $scope.$on('IdleTimeout', function() {
        closeModals();
        $scope.timedout = $uibModal.open({
          templateUrl: 'timedout-dialog.html',
          windowClass: 'modal-danger'
        });
        $scope.stop();
        me.salir();
      });

      $scope.start = function() {
        console.log('start');
        closeModals();
        Idle.watch();
      };

      $scope.stop = function() {
        console.log('stop');
        closeModals();
        Idle.unwatch();
      };






      var pos;
      $scope.usuario=[];
      me.editUsuario=[];

      $scope.reservado=0;
      me.post=false;
      me.mensaje="perfil";
      var usr = $cookieStore.get('usuario');

      me.noticacion={
        id_notificacion:0,
        codigo_usuario:'',
        codigo_libro:'',
        descripcion:'',
        estado:0,
        tipo:''
      }

      HomeResource.get({codigo:usr.codigo_usuario},function(data){
        if(data.length!=0){
          $scope.usuario=data;
         me.editUsuario=JSON.parse( JSON.stringify($scope.usuario) );
        }
         
      });

      HomeResource.query(function(data){
        // console.log("data 1",data);
         $scope.areas=data;
      });

      HomeResource.call({codigo:usr.codigo_usuario},function(data){
        $scope.reservas=data;
      });

      HomeResource.waits({codigo:usr.codigo_usuario},function(data){
        $scope.esperas=data;
      })
      HomeResource.note({codigo:usr.codigo_usuario},function(data){
        $scope.cantidad=0;
        for (var i = 0; i < data.length; i++) {
          if(data[i].estado == 0){
            $scope.cantidad++;
          }
        }
        var temp = null;
        for (var i=0; i<data.length; i++){
              for (var j=0 ; j<data.length - 1; j++){
                 if (data[j].id_notificacion < data[j+1].id_notificacion){
                      temp = data[j];
                      data[j] = data[j+1];
                      data[j+1] = temp;}
              }
        }
        $scope.notificaciones=data;
        console.log($scope.notificaciones);
      })
    HomeResource.dash(function(data){
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
      if(data!=null || data!=undefined){
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

    socket.on('notificacion', function(data){
      console.log(data);
          for (var i = 0; i <data.length; i++) {
            if(data[i].codigo_usuario==usr.codigo_usuario){
              $scope.notificaciones.unshift(data[i]);
              $scope.cantidad=$scope.notificaciones.length;
              // if($state.params.Book==data[i].codigo_libro){
              //  me.reservado=0;
              // }
            }
          }
        });

    socket.on('notificacionAdmin',function(data){
        if(usr.codigo_usuario == data[0].codigo_usuario){
          if($scope.notificaciones.length==0){
            $scope.notificaciones.unshift(data[0]);
            $scope.cantidad=$scope.notificaciones.length;
          }
          else{
            if($scope.notificaciones[0].id_notificacion!=data[0].id_notificacion){
              $scope.notificaciones.unshift(data[0]);
              $scope.cantidad=$scope.notificaciones.length;
            }
          }
          
        }
      
      
    })

    socket.on('reservas',function(data){
      var reservas2=[];
      var contador =0;
      for (var i = 0; i < data.length; i++) {
        if(usr.codigo_usuario == data[i].codigo_usuario){
          contador++;
          reservas2.push(data[i]);
        }
      }
      if(contador!=$scope.reservas.length){
        $scope.reservas=reservas2;
      }
    })
    var cont=false;
    socket.on('penalizado',function(data){
      for (var i = 0; i < data.length; i++) {
        if(data[i].codigo_usuario==usr.codigo_usuario){
          if($cookieStore.get('usuario')!=undefined){
            swal({
                  confirmButtonColor: '#009688',
                    cancelButtonColor: '#d33',
                  title:'¡Usted ah incumplido una norma!',
                  html:'Su cuenta ha sido desactivada como método de sanción',
                  type:'info'
                })
            me.salir();
          }
        }
      }
    })


      var uno="";
      me.state=true;
      me.actualizar = function(estado){
        me.editUsuario=JSON.parse( JSON.stringify($scope.usuario) );
        me.state=estado;
      }

       
      $scope.newImage = {};
      
      $scope.photoChanged = function(files){
        if (files != null) {
          var file={image:files,codigo:$scope.usuario.codigo_usuario};
          HomeResource.update(file, function(result) {
            $scope.usuario.perfil_usuario=result.url;
          }); 
        }
      };

      me.editar = function(estado){
        HomeResource.update(me.editUsuario,function(data){
          $scope.usuario=me.editUsuario;
          console.log(data);
        });
         me.state=estado;
      };

      me.verLibro = function(idx){
        pos = idx;
        me.preVista=$scope.reservas[idx];
        me.thehora=new Date(me.preVista.fecha_inicio);
        me.thehora2=new Date(me.preVista.fecha_limite);

        me.fecha_inicio =$filter('date')(me.thehora, 'd MMM, y');
        me.hora_inicio=$filter('date')(me.thehora, 'h:mm'); 
        me.fecha_limite =$filter('date')(me.thehora2, 'd MMM, y');
        me.hora_limite =$filter('date')(me.thehora2, 'h:mm');

      };

      me.cancelarReserva = function(){
        swal({
          title: '¿Está dseguro de esto?',
          text: "¡Pienselo dos veces!",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#009688',
                cancelButtonColor: '#d33',
          confirmButtonText: '¡Sí, Cancelarlo!',
          cancelButtonText: '¡No, Volver!'
        }).then(function () {
           HomeResource.remove({id:$scope.reservas[pos].codigo_reserva,codLibro:$scope.reservas[pos].codigo_libro},function(data){
          $scope.reservas.splice(pos, 1);
        });
          swal({
             confirmButtonColor: '#009688',
                cancelButtonColor: '#d33',
                title:'Cancelado',
                  html:'Tu reserva fue cancelada',
                  type:'success'
              
          })
        })
      };


      
      me.showDatepicker=function($event){
        $event.preventDefault();
        $event.stopPropagation();
        me.open=!me.open;
      }

      me.postergar = function(){
        me.post=!me.post;
        if(me.post==false){

          me.hora_limite =$filter('date')(me.thehora2, 'h:mm');
          me.fecha_limite =$filter('date')(me.fecha_limite, 'd MMM, y');

          var fecha=new Date(me.fecha_limite);
          var fecha2=$filter('date')(fecha, "yyyy-MM-dd");
        
          var completo = fecha2+' '+$scope.reservas[pos].fecha_limite.split(' ')[1];
          me.preVista.fecha_limite=completo;
          console.log(me.preVista);
          HomeResource.save(me.preVista,function(data){
            console.log(data);
          })
        }else{
          me.fecha_limite =new Date(me.fecha_limite);
          me.maxday=new Date($scope.reservas[pos].fecha_inicio);
          var dayOfMonth = me.maxday.getDate();
          me.maxday.setDate(dayOfMonth +4);
        }
      }

      me.verificar= function(){
        console.log(me.fecha_limite);
        if(me.fecha_limite<new Date() || me.fecha_limite>me.maxday){
          swal({
            confirmButtonColor: '#009688',
            cancelButtonColor: '#d33',
            title:'¿Está loco?',
            html:'Es imposible postergarlo para ese día',
            type:'question'
          })
          me.fecha_limite=new Date($scope.reservas[pos].fecha_limite);
        }
      }
      me.passwords={
        codigo_usuario:'',
        password1:'',
        password2:'',
        contrasena_usuario:''
      }

      me.changePassword = function(){
        swal({
          title: 'Confirmar cambio de contraseña',
          text:'Ingrese su contraseña actual para confirmar el cambio de contraseñas',
          input: 'password',
          confirmButtonColor: '#009688',
                cancelButtonColor: '#d33',
          showCancelButton: true,
          confirmButtonText: 'Submit',
          showLoaderOnConfirm: true,
          preConfirm: function(text) {
            return new Promise(function (resolve, reject) {
                    setTimeout(function() {
                    HomeResource.pass({contrasena_usuario:text,codigo_usuario:$scope.usuario.codigo_usuario},function(data){
                        if (text && data.nombre_usuario) {
                          resolve()
                        } else {
                            reject("Contraseña incorrecta");
                        }
                    })
                  }, 2000)
                })
          },
          allowOutsideClick: false
        }).then(function(text) {
           me.passwords.codigo_usuario=$scope.usuario.codigo_usuario;
           me.passwords.contrasena_usuario=text;
            HomeResource.change(me.passwords,function(data){
              swal({
                confirmButtonColor: '#009688',
                cancelButtonColor: '#d33',
                  type: 'success',
                  title: '¡Ya lo cambiamos de vuelta ya vuelta!',
                  html: 'Volveremos a iniciar sesión'
              })
              me.salir();
            });
        },function (dismiss) {
            if (dismiss === 'cancel') {
              swal({
                confirmButtonColor: '#009688',
                cancelButtonColor: '#d33',
                title:'Cancelado',
                  html:'Tu vida imaginaria esta azalvo :)',
                  type:'error'
              }
                  
              )
          }
        });   
      }

      me.desnotificar= function(idx){
        console.log("hola",$scope.notificaciones[idx]);
        HomeResource.state($scope.notificaciones[idx],function(data){
          $scope.notificaciones[idx].estado=1;
          if($scope.cantidad>0){
            $scope.cantidad=$scope.cantidad-1;
          }
          
          console.log(data);
        });
      }

      $scope.verPublicacion=function(){
        $scope.cant=0;
        
      }



      me.salir=function(){
        $cookieStore.remove('estaConectado');
        $cookieStore.remove('usuario');

        $state.go('BooksApp.presentacion');
      }
  }
}());