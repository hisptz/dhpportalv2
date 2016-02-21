(function() {
    'use strict';

    angular
        .module('dhpportal')
        .config(function($httpProvider) {
            $httpProvider.defaults.withCredentials = true;
        })
        .controller('mainController', mainController);

    mainController.$inject   = ['$scope','$cookies','$http','$timeout','$location','DTOptionsBuilder', 'DTColumnDefBuilder','profileService','utilityService','portalService','chartService','mapService'];
    function mainController($scope,$cookies,$http,$timeout,$location,DTOptionsBuilder, DTColumnDefBuilder,profileService,utilityService,portalService,chartService,mapService) {
        var main  = this;
        var date = new Date();
         // this is the main object do not delete this variable
        $scope.dashboardObject = {displayMap:true,displayChart:false,displayTable:false};

        $scope.dashboardObject.map = {};
        $scope.dashboardObject.chart = {};
        $scope.dashboardObject.table = {};


        // set current year
        $scope.current_year = date.getFullYear();

        // set default selected period
        $scope.selectedYear = $scope.current_year;
        $scope.selected = date.getFullYear();


        $scope.custome_height    ="default";
        $scope.begginingOfthePeriod = 2011;
        $scope.viewOpen          = false;
        $scope.csv_menu            = false;
        $scope.facilityUid         = null;

        $scope.current_id          = "m0frOspS7JY";
        $scope.data              = {};
        $scope.Documents = null;
        $scope.current_pdf_link = null;
        $scope.clickedDistrict = "";
        $scope.viewOpen = false;
        $scope.chart_shown = true;
        $scope.available_files_this_year = null;
        $scope.submitted = 0;
        $scope.total_facilities = 166;
        $scope.submitted = 0;
        $scope.form_period = null;
        $scope.orgunit = null;
        $scope.org_unit_selected = null;
        $scope.regions = [];
        $scope.form={form_period:$scope.current_year,org_unit_selected:""};
        $scope.showProgress = false;
        $scope.logedIn = false;
        $scope.progressLogin = false;
        $scope.logedOut = true;
        $scope.shownHtml = true;
        $scope.shownPdf = false;
        $scope.currentLogedUser = $cookies.get('current_user');
        $scope.selectedDistrictName = "";
        $scope.message_class = null;
        $scope.progressPercent = '0%';
        $scope.orgUnitTable = [];
        $scope.organisationUnitTree = [];
        $scope.logedSuccessMessage = null;
        $scope.logedFailureMessage = null;
        $scope.profile = {};
        $scope.chartConfig = false;
        $scope.netfailure = null;
        $scope.totalMales = 0;
        $scope.totalFemales = 0;



        //// front page UX functions
        $scope.showMaps = function(){
            $scope.dashboardObject.displayMap = true;
            $scope.dashboardObject.displayChart = false;
            $scope.dashboardObject.displayTable = false;
        }
        $scope.showCharts = function(){
            $scope.dashboardObject.displayMap = false;
            $scope.dashboardObject.displayChart = true;
            $scope.dashboardObject.displayTable = false;
        }
        $scope.showTables = function(){
            $scope.dashboardObject.displayMap = false;
            $scope.dashboardObject.displayChart = false;
            $scope.dashboardObject.displayTable = true;
        }
        $scope.downloadExcel = function(){
//            $scope.dashboardObject.displayMap = true;
//            $scope.dashboardObject.displayChart = false;
//            $scope.dashboardObject.displayTable = false;
        }





        if(localStorage.getItem("seriesObject")||localStorage.getItem("seriesObject")!=null){
            localStorage.removeItem("seriesObject");
        }
        if($cookies.get('dhis_enabled')){
            $scope.logedIn = true;
            $scope.logedOut = false;
        }
        $scope.showChart = function(){
            $scope.showChD = "active";
            $scope.showTabD = "";
            $scope.showChartD = "display:block;";
            $scope.showTableD = "display:none;";
        }

        $scope.showTable = function(){
            $scope.showTabD = "active";
            $scope.showChD = "";
            $scope.showChartD = "display:none;";
            $scope.showTableD = "display:block;";
        }
        $scope.backToChart = function(){
            $scope.viewOpen = false;
            $scope.chart_shown = true;
        }

        $scope.drawTable = function(){

        }

        $scope.showHtml = function(){
            $scope.shownHtml = true;
            $scope.shownPdf = false;
        }

        $scope.showPdf = function(filename,year){
            $scope.prepareDocumentFile();
            $scope.shownHtml = false;
            $scope.shownPdf = true;
        }

        //broadcast event that year has changed
        $scope.$watch("selectedYear",function(oldOne,newOne){
            $scope.chart_shown = true;
            $scope.netfailure = null;
            $scope.$watch("$scope.available_files_this_year",function(oldOneI,newOneI){
                $scope.$broadcast ('yearChangedEvent');
            });

            $scope.drawChart();
        });

        $scope.drawChart = function(){
            $scope.chartConfig = null;
            $scope.$on("drawChartNow", function(e, data) {
                var chartobject = chartService.getChartObject();
                $scope.chartConfig = chartobject;
            });
        }

            $scope.$on('netfailure',function(){
                $scope.netfailure = true;
            });
        $scope.getChildren = function(children){
            var childrens = [];
            angular.forEach(children,function(value,index){
                childrens.push({name:value.name,id:value.id});
            });

            return childrens;
        }

        $scope.treeCallback = function(attributes){
            $scope.chart_shown = false;
            $scope.backToGrid();
            // deselect by node reference
            ivhTreeviewMgr.deselect($scope.data.organisationUnits, $scope.current_id);

            var orgUnit = attributes.ivhNode;
            var name = orgUnit.name;
            $scope.selectedDistrictName = name;
            var id = orgUnit.id;
            //$scope.processView(orgUnit,name,id);
            $scope.processViewPdf(orgUnit,name,id);
            $scope.current_id = id;
        }


        $scope.getHealthProfileFromTable = function(row){
            $scope.openPdfFile(row);
        }

        $scope.getHealthProfileFromView = function(row){
            var file = {name:row.facility,id:row.id};
            $scope.openPdfFile(file);
        }
        $scope.getHealthProfileFromMap = function(row){

        }

        $scope.processView = function(orgUnit,name,id){
            var orgUnitWithFiles = JSON.parse(localStorage.getItem('widataset'));
            if(orgUnit.children!=null){
                var children = $scope.getChildren(orgUnit.children);

            }else{
                var children = [];
            }

            if(name.indexOf("Region")>=0||name.indexOf("Council")>=0){

                if(name.indexOf("Region")>=0){
                    var proposed_files= [];
                    angular.forEach(children,function(value,index){
                        if(orgUnitWithFiles.indexOf(value.id)>=0){
                            proposed_files.push({id:value.id,facility:value.name,file:value.name+"_"+value+"_"+$scope.selectedYear+".pdf"});
                        }
                    });
                    var correct_names=[];
                        $scope.Documents = proposed_files;
                }

                if(name.indexOf("Council")>=0){
                    var proposed_files= [];
                    if(orgUnitWithFiles.indexOf(orgUnit.id)>=0||orgUnitWithFiles.indexOf(id)>=0){
                        if(orgUnit==null){
                            proposed_files.push({id:orgUnit.id,facility:orgUnit.name,file:orgUnit.name+"_"+$scope.selectedYear+".pdf"});

                        }else{
                            proposed_files.push({id:id,facility:name,file:name+"_"+$scope.selectedYear+".pdf"});
                        }
                    }
                        $scope.Documents = proposed_files;


                }

            }else{
                //alert("select Region or council");
            }
        }



        $scope.processViewPdf = function(orgUnit,name,id){
            var proposed_files = [];
            var orgUnitWithFiles = JSON.parse(localStorage.getItem('widataset'));
            if(orgUnit.children!=null){
                if(orgUnit.name.indexOf('Tanzania')>=0){
                    angular.forEach(orgUnit.children,function(chValue,chIndex){
                        var grandChildren = $scope.getChildren(chValue.children);
                        proposed_files    = $scope.getOrgunitProposesdFiles(grandChildren,$scope.selectedYear,orgUnitWithFiles,proposed_files);

                    });
                }else{
                        var Children      = $scope.getChildren(orgUnit.children);
                        proposed_files    = $scope.getOrgunitProposesdFiles(Children,$scope.selectedYear,orgUnitWithFiles,proposed_files);
                }

            }else{
                var children = [];
                if(orgUnitWithFiles.indexOf(orgUnit.id)){
                proposed_files.push({id:id,facility:name,file:name+"_"+$scope.selectedYear+".pdf"});
                }
            }

            $scope.Documents = proposed_files;
        }

        $scope.getOrgunitProposesdFiles = function(children,selectedYear,orgUnitWithFiles,proposed_files){
            angular.forEach(children,function(value,index){
                if(orgUnitWithFiles.indexOf(value.id)>=0){
                    proposed_files.push({id:value.id,facility:value.name,file:value.name+"_"+$scope.selectedYear+".pdf"});
                }
            });
            return proposed_files;
        }
        $scope.prepareDocumentFile = function(){


        }

        $scope.backToGrid = function(){
            $scope.viewOpen = false;
        }
        $scope.openPdfFile = function(row){
            var form = {org_unit_selected:row.id,form_period:$scope.selectedYear};
            $scope.profileTitle = row.name;

            $scope.current_pdf_link = "uploads/"+row.name+"_"+$scope.selectedYear+".pdf";
            $scope.clickedDistrict = row.name+" "+$scope.selectedYear;
            $scope.viewOpen = true;
            $scope.custome_height ="not_found";

            $scope.previewData(form);

        }

        $scope.filterProfiles = function(data){

            var dataElement  = localStorage.getItem('dataElementNames');
            dataElement = JSON.parse(dataElement);
            angular.forEach(dataElement,function(valueOfDataEl,indexOfDataEl){
                $scope.profile[valueOfDataEl] = "";
            });

        }

        $scope.previewData = function(form){
            var profiledata = {};

            utilityService.getDataPreview(form).then(function(data){
                $scope.filterProfiles(data);

                utilityService.prepareTabledata(data).then(function(){
                    profiledata = utilityService.tableDatas;
                    angular.forEach(profiledata,function(profileValue,profileIndex){
                        if($scope.profile[profileValue.name] !="undefined"){
                            $scope.profile[profileValue.name] = profileValue.value;
                            console.log(profileValue.name+"   =>   "+profileValue.value);
                        }
                    });

                });

            },function(response){
                console.log(data);
            });
        }



        $scope.getOrgunitFileStatistics = function(facility_name){
            var file_counts = 0;
            var total = 0;
            angular.forEach($scope.available_files_this_year,function(value,index){
                if(value.indexOf(facility_name)>=0){
                    file_counts++;
                }
                total++;
            });
            return {orgUnit:facility_name,count:file_counts,total:total};
        }
  
        $scope.getOrgUnitWithAvailableFilesThisYear = function(){
            $scope.$on("drawChartNow", function(e, data) {
                var objectSeries = JSON.parse(localStorage.getItem("seriesObject"));
                $scope.orgUnitTable = [];
                angular.forEach(objectSeries,function(valueObject,indexObject){
                        if(valueObject.count>0){
                            $scope.orgUnitTable.push({name:valueObject.orgUnit,id:valueObject.id});
                        }
                });
            });
        };
        $scope.getOrgUnitWithAvailableFilesThisYear();


        /// get organisation unit string for map
        $scope.orgunitString = "";
        function prepareOrgUnitStrings(){
            var orgString = "";

//            $scope.$watch($scope.objectsselected,function(value1,value2){
            angular.forEach($scope.objectsselected,function(value,index){
                orgString+=value.id+";";
//                });

                if(orgString.length>0){
                    $scope.orgunitString = orgString.substring(0, orgString.length - 1);
                }
            });

        }

        // load organisation unit fro tree
        $scope.loadOrganisationUnit = function(){

            // login to dhis server for pulling authenticated resources
            utilityService.login('Demo','HMISDEMO2016').then(function(success){

                // load organisation units
                utilityService.loadOrganisationUnits().then(function(data){

                    /// initialize tree varaibale after safe login
                    $scope.organisationUnitTree = data.organisationUnits;
                    $scope.modifedOrgunits = utilityService.modifyOrgUnits(data.organisationUnits[0].children);
                    $scope.selectedItems = $scope.organisationUnitTree;


                    $scope.selectPeriod = function(){
                        $scope.registerChanges($scope.selectedYear,$scope.selectedItems);
                    }

                    // callback for organisation unit selection from tree
                        var monitor = 0;
                        $scope.$watch('selectedItems',function(newvalue,oldvalue){
                            if(monitor<1){
                                $scope.registerChanges($scope.selectedYear,newvalue);
                                monitor++
                            }else{
                                monitor = 0;
                            }

                        });



                },function(status){

                    console.warn("organisation unit can't load internal server or network error")
                });

            },function(failure){
                console.warn("login failure can't load organisation units")
            })


        }
        $scope.loadOrganisationUnit();


        $scope.registerChanges = function(newperiod,newvalue){
            if(!newvalue||newvalue.length==0){
                portalService.districts = [];
                newvalue = $scope.organisationUnitTree;
                $scope.objectsselected = portalService.getProjects(newvalue);
            }else{
                portalService.districts = [];
                $scope.objectsselected = portalService.getProjects(newvalue);
            }


            prepareOrgUnitStrings();


            /// load data from the dhis server
            var default_url = "api/analytics.json?dimension=dx:"+portalService.dataelements+"&dimension=ou:LEVEL-3;m0frOspS7JY&filter=pe:"+newperiod;
            var selective_url = "api/analytics.json?dimension=dx:"+portalService.dataelements+"&dimension=ou:LEVEL-3;"+$scope.orgunitString+"&filter=pe:"+newperiod;

            var url=profileService.baseDHIS+ default_url;
            if(newvalue.length==1&&newvalue[0].id=="m0frOspS7JY"){

            }else{
                url = profileService.baseDHIS+selective_url;
            }
            $http({method:'GET',url:url,dataType:'json',catche:true,isModified:true}).then(function(analytics){

                var analytics_data = analytics.data;


                mapService.renderMap($scope.selectedYear,$scope.orgunitString).then(function(orgunits){
                    console.info("DATA FROM RENDER MAP");
                    if(typeof orgunits.data == "object" ){

                        angular.extend($scope.dashboardObject.map,mapService.prepareMapObject(orgunits.data,analytics_data));
                    }else{
                        Materialize.toast("User is loged out", 3000)
                    }

                    $scope.dashboardObject.chart.chartObject = mapService.chartObject;
                    $scope.dashboardObject.table.tableObject = mapService.tableObject;
//                    $scope.dashboardObject.displayChart = true;

                },function(response){
                    Materialize.toast("GEOJSON FAILURE "+ response, 3000)
                });


            },function(failure){
                console.warn("ANALYTICS FAILURE: ");
                console.warn(failure);
            });


            var orgNames = ""
            angular.forEach(newvalue,function(value){
                orgNames += value.name+",";
            });

            $scope.orgUnitNames = orgNames.substring(0, orgNames.length - 1);



        }

        $scope.getOrganisationUnit = function(){
            utilityService.getOrgUnits().then(function(data){
                $scope.data.organisationUnits = data.organisationUnits;
                $scope.regions = utilityService.modifyOrgUnits(data.organisationUnits[0].children);
            },function(status){

            });
        }
        $scope.getOrganisationUnit();


        $scope.modifyOrgUnits = function(rawOrgUnits){
            var Regions = [];

            angular.forEach(rawOrgUnits,function(value,index){
                var regions = {value:value.name,children:[]};
                angular.forEach(value.children,function(valueChildren,indexChildren){
                    $scope.total_facilities++;
                    regions.children.push({name:valueChildren.name,value:value.name+"_"+valueChildren.name});
                });
                Regions.push(regions);
            });

            return Regions;
        }

        $scope.getPeriod = function(start_period){
            var date = new Date();
            var periods = [];
            var thisyear = date.getFullYear();
            for(var i=Number(thisyear);i>=Number(start_period);i--){
                periods.push({name:i,value:i})
            }
            return periods;
        };
        $scope.periods	=	$scope.getPeriod($scope.begginingOfthePeriod);// the beggining of the period


        $scope.getLeftNav = function(){
            $scope.message = null;
            if($scope.csv_menu){
                $scope.csv_menu = false;
            }else{
                $scope.csv_menu = true;
            }

        }
        $scope.getDashboard = function(){
            //$scope.csv_menu = false;


        }
        $scope.Logout = function(){
            if($cookies.get('dhis_enabled')){
                $cookies.remove('dhis_enabled');
                $cookies.remove('current_user');
            }
            $cookies.remove('dhis_enabled');
            $scope.currentLogedUser = "";
            $scope.logedIn = false;
            $scope.logedOut = true;
            $scope.csv_menu = false;
            $scope.logedSuccessMessage = null;
            $scope.logedFailureMessage = null;
            $location.path("/");
        }

        $scope.login = function(login){

            $scope.progressLogin = true;
            var username = login.dhis_login_username;
            var password = login.dhis_login_password;
                utilityService.login(username,password).then(function(data){
                    $scope.progressLogin = false;
                        utilityService.getUserDetails().then(function(userdata){
                            if(typeof(userdata)=="object"&&userdata.userCredentials.code==username&&username!="Demo"){
                                $cookies.put('dhis_enabled', 'logedIn');
                                $cookies.put('current_user', userdata.displayName);
                                $scope.currentLogedUser = $cookies.get('current_user');
                                $scope.progressLogin = false;
                                $scope.logedIn = true;
                                $scope.logedOut = false;
                                $scope.logedSuccessMessage = "LoggedIn as "+userdata.displayName+": Connected to DHIS2.";
                                $scope.closeLoginForm();
                            utilityService.getDataElements().then(function(data){
                                utilityService.prepareDataElementUid(data);
                                utilityService.prepareDataElementNames(data);
                            });
                            }else{
                                $cookies.remove('dhis_enabled');
                                $cookies.remove('current_user');
                                $scope.logedIn = false;
                                $scope.logedOut = true;
                                $scope.logedFailureMessage = "Login Failed : invalid user name or password";
                                $scope.progressLogin = false;
                            }


                        },function(response){
                                $cookies.remove('dhis_enabled');
                                $cookies.remove('current_user');
                                $scope.logedIn = false;
                                $scope.logedOut = true;
                                $scope.logedFailureMessage = "Login Failed: check network connection";
                                $scope.progressLogin = false;
                        });
                },function(response){
                                $cookies.remove('dhis_enabled');
                                $cookies.remove('current_user');
                                $scope.logedIn = false;
                                $scope.logedOut = true;
                                $scope.logedFailureMessage = "Login Failed: check network connection";
                                $scope.progressLogin = false;
                });


        }


        $scope.getLoginForm = function(){
            $scope.logedSuccessMessage = null;
            $scope.logedFailureMessage = null;
            $('#modal1').openModal();

        }
        $scope.closeLoginForm = function(){
            $('#modal1').closeModal();

        }

        $scope.submit = function(form) {

            if(form.org_unit_selected&&form.form_period){

                var new_file_name = form.org_unit_selected+"_"+form.form_period+".pdf";
                $scope.upload($scope.file,new_file_name);
            }else{
                $scope.message = "no name and period specified";
            }

        };

        // upload on file select or drop
        $scope.upload = function (file,new_file_name) {
            Upload.upload({
                url: 'server/process.php?file=1&new_file_name='+new_file_name,
                data: {file: file}
            }).then(function (resp) {
                $scope.showProgress = false;
                if(resp.data=="UPLOAD_FAILED"){
                    $scope.message = "upload failed";
                    $scope.message_class = "failed";
                }

                if(resp.data=="UPLOAD_SUCCESS"){
                    $scope.getAvailableFilesThisYear();
                    $scope.message = "uploaded successful";
                    $scope.message_class = "success";
                }

                if(resp.data=="FILE_EXIST_ERROR"){
                    $scope.message = "file exist";
                    $scope.message_class = "failed";
                }

                if(resp.data=="INVALID_TYPE_ERROR"){
                    $scope.message = "file is not pdf";
                    $scope.message_class = "failed";
                }

            }, function (resp) {
                $scope.showProgress = false;
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                console.log(evt);
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                if(!evt.config.data.file){
                    $scope.message = "no file specified";
                }else{
                    $scope.showProgress = true;
                    $scope.progressPercent = progressPercentage+'%';
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                }


            });
        };



    }


})();