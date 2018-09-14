var app = angular.module('booksApp')
app.directive("changeForm", function($compile){
    return function(scope, element, attrs){
        element.bind("click", function(){
                if(attrs.class=='toggle'){
                    $('.container').stop().addClass('active');
                }else{
                     $('.container').stop().removeClass('active');
                }
               
        });
    };
});