var app = angular.module('booksApp')
app.directive("clickBook", function($compile){
    return function(scope, element, attrs){
        element.bind("click", function(){
        	var list = $("#remove"); 
            if(attrs.id=='vista'){
                 $(".moviecard").addClass("movie-view-trailer");
                 list.addClass('display');
                 // console.log(list); 
            }else{
                 $(".moviecard").removeClass("movie-view-trailer");
                 list.removeClass('display');
            }
        });
    };
});