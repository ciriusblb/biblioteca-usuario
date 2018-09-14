var app = angular.module('booksApp')
app.directive("clickMove", function($compile){
    return function(scope, element, attrs){
        element.bind("click", function(){

        // $('html,body').animate({
        //     scrollTop: $("#3").offset().top
        // }, 2000);

            


        });
    };
});