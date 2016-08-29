/**
 * Created by mpande on 8/29/16.
 */
angular.module("dhpportal")
.$inject   = ['$scope','$rootScope','$cookies','$filter','$http','$timeout','$interval','$location','dataService','profileService','utilityService','portalService','chartService','olData','olHelpers','mapService']
.controller("homeController",function ($scope,$rootScope,$cookies,$filter,$http,$timeout,$interval,$location,dataService,profileService,utilityService,portalService,chartService,olData,olHelpers,mapService) {

    $scope.printProfile = function(divName) {
        console.log(divName);
        var printContents = document.getElementById(divName).innerHTML;
        var originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
    }

});