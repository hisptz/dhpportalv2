/**
 * Created by kelvin on 1/9/15.
 */
angular.module("dhpportal")
    .run( function($rootScope, $location) {
        // register listener to watch route changes
        $rootScope.$on( "$routeChangeStart", function(event, next, current) {
            Pace.restart()
        });
    })
    .config( function($routeProvider){
        $routeProvider.when("/home",{
            templateUrl: 'views/home.html',
            controller: 'mainController'
        });
        $routeProvider.otherwise({
            redirectTo: '/home'
        });



    });
