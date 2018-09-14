(function(){
    'use strict';
     angular.module('booksApp')
      .directive('numbersFloat', function () {
            return {
                require: 'ngModel',
                link: function (scope, element, attr, ngModelCtrl) {
                    function fromUser(text) {
                        
                        if (text) {console.log(text);
                            if (parseFloat(text)<1) {
                                console.log("hola");
                              $('#email').attr("data-content", "No menos de 0 cm"); $('#email').popover("show");
                            }else{
                                $('#email').popover('destroy');
                            }

                        }
                    }            
                    ngModelCtrl.$parsers.push(fromUser);
                }
            };
        });


}());