/**
 * Created by mpande on 8/29/16.
 */

    angular
        .module('dhpportal')
        .controller('homeController', homeController);

    homeController.$inject   = ['$scope','$rootScope','$cookies','$filter','$http','$timeout','$interval','$location','$routeParams','dataService','profileService','utilityService','portalService','chartService','olData','olHelpers','mapService','pendingRequestsService'];
    function homeController($scope,$rootScope,$cookies,$filter,$http,$timeout,$interval,$location,$routeParams,dataService,profileService,utilityService,portalService,chartService,olData,olHelpers,mapService,pendingRequestsService) {

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
            dataService.getPopulationData(organisationUnit,year).then(function(data){
                $scope.population = {};

                $scope.population = dataService.createPopulationObject(data);

            },function(response){

            });

            //// get automated dhis indicators
            dataService.getAutomatedIndicator(organisationUnit,year).then(function(data){

                $scope.fromDHIS = dataService.assembleDataFromDHIS(data,year);

            },function(response){
                console.warn("failed to pull automated indicators failed to pull");
            });


            dataService.getIndicatorTopTenMortality(organisationUnit,year).then(function(results){

                $scope.toptenCauses = dataService.refineTopTenMoltalityIndicators(results,year);
            },function(response){
                console.warn("failed to load top ten indicators");
            });


            dataService.getIndicatorTopTenAdmissions(organisationUnit,year).then(function(results){


                $scope.toptenAdmission = dataService.refineTopTenAdmissionIndicators(results,year);
            },function(response){
                console.warn("failed to load top ten indicators");
            });


        }

    }
