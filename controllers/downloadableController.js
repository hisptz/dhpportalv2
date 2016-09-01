/**
 * Created by kelvin on 10/20/15.
 */

angular.module("dhpportal")
    .controller("downloadableController",function ($rootScope,$scope,$q,$http,$timeout,portalService,dataService) {
        $rootScope.updateDataContainers = function(){
            console.log(dataService);
            dataService.loadAllFiles().then(function(files){
                console.log(files);
            },function(failure){

            })
        }

    });