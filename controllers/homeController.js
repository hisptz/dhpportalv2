/**
 * Created by mpande on 8/29/16.
 */

    angular
        .module('dhpportal')
        .controller('homeController', homeController);

    homeController.$inject   = ['$scope','$rootScope','$cookies','$filter','$http','$timeout','$interval','$location','$routeParams','dataService','profileService','utilityService','portalService','chartService','olData','olHelpers','mapService'];
    function homeController($scope,$rootScope,$cookies,$filter,$http,$timeout,$interval,$location,$routeParams,dataService,profileService,utilityService,portalService,chartService,olData,olHelpers,mapService) {
        $scope.selectedYear = $rootScope.selectedYear;
        $rootScope.updateDataContainers = function(){

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


            //dataService.getIndicatorDataDistribution(organisationUnit,year).then(function(data){
            //    //console.log("HEALTH STATUS");
            //    $scope.healthDistribution = dataService.createHealthStatusObject(data,year);
            //
            //},function(response){
            //    console.warn("failed to pull data districution indicators");
            //});

            //dataService.getIndicatorDataDelivery(organisationUnit,year).then(function(data){
            //    $scope.healthDelivery = dataService.assembleDataFromDHIS(data,year);
            //},function(response){
            //    console.warn("failed to pull data delivery indicators");
            //});


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
