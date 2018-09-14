var app = angular.module('booksApp')
app.directive("clickMenu", function($compile){
    return function(scope, element, attrs){
        element.bind("click", function(){
        if(attrs.id=="menu-icon"){
            $("#chang-menu-icon").toggleClass("fa-bars");
            $("#chang-menu-icon").toggleClass("fa-times");
            $("#show-nav").toggleClass("hide-sidebar");
            $("#show-nav").toggleClass("left-sidebar");
              
            $("#left-container").toggleClass("less-width");
            $("#right-container").toggleClass("full-width");
        }
        // else{
            // var colores=['yellow','red','blue'];
            // color = colores[Math.floor(Math.random() * colores.length)];
            // console.log($("#snip0057"));
            // $("#snip0057").removeClass($("#snip0057").attr('class'));
            // console.log($("#snip0057"));
            // $("#snip0057").addClass(color);
        // }


            


        });
    };
});