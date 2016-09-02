/**
 * Created by mpande on 8/29/16.
 */

    angular
        .module('dhpportal')
        .controller('homeController', homeController);

    homeController.$inject   = ['$scope','$rootScope','$cookies','$filter','$http','$timeout','$interval','$location','$routeParams','dataService','profileService','utilityService','portalService','chartService','olData','olHelpers','mapService'];
    function homeController($scope,$rootScope,$cookies,$filter,$http,$timeout,$interval,$location,$routeParams,dataService,profileService,utilityService,portalService,chartService,olData,olHelpers,mapService) {

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
                // var data = null;
                // var counter = 0;
                // angular.forEach(results,function(resultValue,resultIndex){
                //     if(typeof resultValue.success =="undefined"){
                //         counter++;
                //         if(counter==1){
                //             data = resultValue;
                //         }else{
                //             var rows = resultValue.rows;
                //             angular.forEach(rows,function(rowValue,rowIndex){
                //
                //                 if ( data.rows )
                //                 {
                //                     data.rows.push(rowValue);
                //                 }
                //
                //             });
                //         }
                //     }else{
                //         console.log("It is not safe to load"); // TODO :put codes here to handle this problem
                //     }
                // });

                $scope.toptenCauses = dataService.refineTopTenMoltalityIndicators(results,year);
            },function(response){
                console.warn("failed to load top ten indicators");
            });


            dataService.getIndicatorTopTenAdmissions(organisationUnit,year).then(function(results){
                var data = null;
                var counter = 0;
                angular.forEach(results,function(resultValue,resultIndex){
                    if(typeof resultValue.success =="undefined"){
                        counter++;
                        if(counter==1){
                            data = resultValue;
                        }else{
                            var rows = resultValue.rows;
                            angular.forEach(rows,function(rowValue,rowIndex){
                                if ( data.rows )
                                {
                                    data.rows.push(rowValue);
                                }
                            });
                        }
                    }else{
                        console.log("It is not safe to load"); // TODO :put codes here to handle this problem
                    }
                });

                $scope.toptenAdmission = dataService.refineTopTenAdmissionIndicators(data,year);
            },function(response){
                console.warn("failed to load top ten indicators");
            });


        }

    }
