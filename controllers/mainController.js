
    angular
        .module('dhpportal')
        .config(function($httpProvider) {
            $httpProvider.defaults.withCredentials = true;
        })
        .controller('mainController', mainController);

    mainController.$inject   = ['$scope','$rootScope','$cookies','$filter','$http','$timeout','$interval','$location','$routeParams','dataService','profileService','utilityService','portalService','chartService','olData','olHelpers','mapService'];
    function mainController($scope,$rootScope,$cookies,$filter,$http,$timeout,$interval,$location,$routeParams,dataService,portalService,utilityService,portalService,chartService,olData,olHelpers,mapService) {
        var main  = this;
        var date = new Date();
        var checker = 0;

        $scope.selectedYear = date.getFullYear();
        $scope.admin = function(){
            window.location.href = "#/admin";
        }

        $scope.drawOrgUnitTree = function(organisationUnit){

            if(typeof $scope.organisationUnitTree == "undefined") {

                $scope.organisationUnitTree = organisationUnit;
            }else{
                $scope.organisationUnitTree = [];
                $scope.organisationUnitTree = organisationUnit;
            }

        }

        // load organisation unit fro tree
        $scope.loadOrganisationUnit = function(){
            checker++;
            console.log('CHEKER',checker);
            $rootScope.failureMessage = null;
            // login to dhis server for pulling authenticated resources
            utilityService.login('Demo','HMISDEMO2016').then(function(success){

                // load organisation units
                utilityService.loadOrganisationUnits().then(function(data){

                    /// initialize tree varaibale after safe login
                    var organisatonunit = data.organisationUnits;
                    if( organisatonunit && organisatonunit.length >= 1 ){
                        organisatonunit[0].isExpanded = false;
                        organisatonunit[0].isActive = true;
                        organisatonunit[0].isFiltered = false;
                        organisatonunit[0].selected = true;
                        $scope.drawOrgUnitTree(organisatonunit);
                    }



                    if ( data.organisationUnits )
                    {
                        $scope.modifedOrgunits = utilityService.modifyOrgUnits(data.organisationUnits[0].children);

                    }

                    $scope.selectedItems = $scope.organisationUnitTree;


                    $scope.selectPeriod = function(){
                        $scope.selectedYear
                        //$scope.registerChanges($scope.selectedYear,$scope.selectedItems);
                    }

                    // callback for organisation unit selection from tree
                    var monitor = 0;

                    $scope.updateDataContainers();

                },function(status){

                    console.warn("organisation unit can't load internal server or network error")
                });



            },function(failure){
                $rootScope.failureMessage = " remote authentication failure try to reload the portal";
            })


        }

        var formerOrganisationUnitObject = [];
        localStorage.setItem('orgUnitNumber',0);
        $scope.selectedCallback = function(item, selectedItems){

            var orgunitNumber = localStorage.getItem('orgUnitNumber');

            if ( orgunitNumber != selectedItems.length  )
            {
                $rootScope.orgUnitNames	=	portalService.getSelectedOrgUnitNames(selectedItems,$scope.organisationUnitTree);// the beggining of the period
                $rootScope.selectedOrgUnit	=	portalService.getSelectedOrgUnit(selectedItems,$scope.organisationUnitTree);// the beggining of the period

                localStorage.setItem('orgUnitNumber',selectedItems.length);
            }else{



            }


        }


        $scope.periods	=	portalService.getPeriod();// the beggining of the period




        $scope.loadOrganisationUnit();



    }
