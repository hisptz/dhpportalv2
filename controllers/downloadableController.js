/**
 * Created by kelvin on 10/20/15.
 */

angular.module("dhpportal")
    .controller("downloadableController",['$rootScope','$scope','$q','$http','$timeout','portalService','dataService',function ($rootScope,$scope,$q,$http,$timeout,portalService,dataService) {
        $rootScope.updateDataContainers = function(){
            console.log(dataService);

            $scope.treeOptions = {
                nodeChildren: "children",
                dirSelectable: true,
                injectClasses: {
                    ul: "a1",
                    li: "a2",
                    liSelected: "a7",
                    iExpanded: "a3",
                    iCollapsed: "a4",
                    iLeaf: "a5",
                    label: "a6",
                    labelSelected: "a8"
                }
            }

            dataService.loadAllFiles().then(function(files){
              $scope.dataForTheTree = dataService.formatDataForTree(files);
            },function(failure){

            })
        }

    }]);
