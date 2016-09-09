/**
 * Created by mpande on 8/29/16.
 */

    angular
        .module('dhpportal')
        .controller('homeController', homeController);

    homeController.$inject   = ['$scope','$rootScope','$cookies','$filter','$http','$timeout','$interval','$location','$routeParams','dataService','profileService','utilityService','portalService','pendingRequestsService'];
    function homeController($scope,$rootScope,$cookies,$filter,$http,$timeout,$interval,$location,$routeParams,dataService,profileService,utilityService,portalService,pendingRequestsService) {

        $scope.isError = [];

        if ( $routeParams.parentUid )
        {
            $rootScope.showBackButton = true;
        }else{
            $rootScope.showBackButton = false;
        }



        $rootScope.updateDataContainers = function(){
            $scope.selectedYear = $scope.selectedYearBuffer;
          var pendingReqiests = pendingRequestsService.get();

            pendingRequestsService.cancelAll();

            if ( $scope.selectedOrgUnit ) {
                $scope.getDHPResources($scope.selectedOrgUnit,$scope.selectedYear);
            }
            else
            {

            }

        }

        $scope.getDHPResources = function(organisationUnit,year){
          $scope.fromDHIS = null;$scope.population = null;
            dataService.getPopulationData(organisationUnit,year).then(function(data){
                $scope.population = {};
                $scope.population = dataService.createPopulationObject(data.data);

                if ( data.statusText !=="OK" ) {
                  $scope.isError['population'] = true;
                }else{
                  $scope.isError['population'] = false;
                }

            },function(response){
                $scope.isError['population'] = true;
            });

            // get automated dhis indicators
            dataService.getAutomatedIndicator(organisationUnit,year).then(function(data){

                $scope.fromDHIS = dataService.assembleDataFromDHIS(data.data,year);

                if ( data.statusText !=="OK" ) {
                  $scope.isError['automated'] = true;
                }else{
                    $scope.isError['automated'] = false;
                  }

            },function(response){
                $scope.isError['automated'] = true;
            });


            dataService.getIndicatorTopTenMortality(organisationUnit,year).then(function(data){

                $scope.toptenCauses = dataService.refineTopTenMoltalityIndicators(data.data,year);
                if ( data.statusText !=="OK" ) {
                  $scope.isError['toptenMortality'] = true;
                }else{
                    $scope.isError['toptenMortality'] = false;
                  }

            },function(response){
                $scope.isError['toptenMortality'] = true;
            });


            dataService.getIndicatorTopTenAdmissions(organisationUnit,year).then(function(data){


                $scope.toptenAdmission = dataService.refineTopTenAdmissionIndicators(data.data,year);
                if ( data.statusText !=="OK" ) {
                  $scope.isError['toptenAdmission'] = true;
                }else{
                    $scope.isError['toptenAdmission'] = false;
                  }

            },function(response){
                $scope.isError['toptenAdmission'] = true;
            });


        }

    }
