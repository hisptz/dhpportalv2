/**
 * Created by kelvin on 10/20/15.
 */

angular.module("dhpportal")
    .controller("downloadableController",function ($rootScope,$scope,$q,$http,$timeout,portalService) {
        $rootScope.updateDataContainers = function(){
            console.log($scope.selectedOrgUnit,'DOWNLOADABLE');
        }

    });