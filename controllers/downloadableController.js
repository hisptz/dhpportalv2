/**
 * Created by Leonard C. Mpande on 31/08/2016.
 */

angular.module("dhpportal")
    .controller("downloadableController",['$rootScope','$scope','$routeParams','$q','$http','$timeout','portalService','dataService',function ($rootScope,$scope,$routeParams,$q,$http,$timeout,portalService,dataService) {

      if ( $routeParams.parentUid )
      {
        $rootScope.showBackButton = true;
      }else{
        $rootScope.showBackButton = false;
      }

      $rootScope.updateDataContainers = function(){
            if ( $routeParams.parentUid != $rootScope.selectedOrgUnit )
            {
                window.location.href = "#/home/downloadable/"+$rootScope.selectedOrgUnit+"/"+$scope.selectedYear;
            }else {

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
                $scope.dataForTheTree = dataService.formatDataForTree(files,$scope.$parent.organisationUnitTree);
              },function(failure){

              })

            }

        }

        $rootScope.updateDataContainers();

    }]);
