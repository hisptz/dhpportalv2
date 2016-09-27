/**
 * Created by mpande on 9/1/16.
 */
//var mainModule = angular.module('dhpportal', ['openlayers-directive','multi-select-tree','treeControl','highcharts-ng','ngFileUpload',"ngRoute",'ui.materialize','ngCookies','ngResource','ngAnimate','dhisHighchartAngularService','angular-spinkit','ngCsv']);
var mainModule = angular.module('dhpportal', ['multi-select-tree','treeControl','ngFileUpload',"ngRoute",'ui.materialize','ngCookies','ngResource','ngAnimate','angular-spinkit','ngCsv','leaflet-directive']);

mainModule.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'views/home.html',
            controller: 'homeController'
        })
        .when('/home/map/:map/:oruntId/period/:perodId', {
            templateUrl: 'views/home.html',
            controller: 'homeController'
        }).when('/home/downloadable/:parentUid/:period', {
            templateUrl: 'views/downloadables.html',
            controller: 'downloadableController'
        })
        .when('/admin', {
            templateUrl: 'views/admin.html',
            controller: 'adminController'
        }).otherwise('/home');

});
