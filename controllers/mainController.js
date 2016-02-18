(function() {
    'use strict';

    angular
        .module('dhpportal')
        .config(function($httpProvider) {
            $httpProvider.defaults.withCredentials = true;
        })
        .controller('mainController', mainController);

    mainController.$inject   = ['$scope','$cookies','$http','$timeout','$location','ivhTreeviewMgr','DTOptionsBuilder', 'DTColumnDefBuilder','profileService','utilityService','portalService','chartService'];
    function mainController($scope,$cookies,$http,$timeout,$location,ivhTreeviewMgr,DTOptionsBuilder, DTColumnDefBuilder,profileService,utilityService,portalService,chartService) {
        var main  = this;
        var date = new Date();
        $scope.custome_height    ="default";
        main.begginingOfthePeriod = 2011;
        $scope.viewOpen          = false;
        main.csv_menu            = false;
        main.facilityUid         = null;
        main.current_year = date.getFullYear();
        main.selectedYear = main.current_year;

        main.current_id          = "m0frOspS7JY";
        $scope.data              = {};
        main.Documents = null;
        main.current_pdf_link = null;
        main.clickedDistrict = "";
        $scope.viewOpen = false;
        main.chart_shown = true;
        main.available_files_this_year = null;
        $scope.submitted = 0;
        $scope.total_facilities = 166;
        $scope.submitted = 0;
        main.form_period = null;
        main.orgunit = null;
        main.org_unit_selected = null;
        main.regions = [];
        $scope.form={form_period:main.current_year,org_unit_selected:""};
        $scope.showProgress = false;
        main.logedIn = false;
        $scope.progressLogin = false;
        main.logedOut = true;
        main.shownHtml = true;
        main.shownPdf = false;
        $scope.currentLogedUser = $cookies.get('current_user');
        $scope.selectedDistrictName = "";
        $scope.message_class = null;
        $scope.progressPercent = '0%';
        main.orgUnitTable = [];
        main.organisationUnitTree = [];
        main.logedSuccessMessage = null;
        main.logedFailureMessage = null;
        main.profile = {};
        main.chartConfig = false;
        main.netfailure = null;
        main.totalMales = 0;
        main.totalFemales = 0;
        if(localStorage.getItem("seriesObject")||localStorage.getItem("seriesObject")!=null){
            localStorage.removeItem("seriesObject");
        }
        if($cookies.get('dhis_enabled')){
            main.logedIn = true;
            main.logedOut = false;
        }
        main.showChart = function(){
            main.showChD = "active";
            main.showTabD = "";
            main.showChartD = "display:block;";
            main.showTableD = "display:none;";
        }

        main.showTable = function(){
            main.showTabD = "active";
            main.showChD = "";
            main.showChartD = "display:none;";
            main.showTableD = "display:block;";
        }
        main.backToChart = function(){
            $scope.viewOpen = false;
            main.chart_shown = true;
        }

        main.drawTable = function(){

        }

        main.showHtml = function(){
            main.shownHtml = true;
            main.shownPdf = false;
        }

        main.showPdf = function(filename,year){
            main.prepareDocumentFile();
            main.shownHtml = false;
            main.shownPdf = true;
        }

        //broadcast event that year has changed
        $scope.$watch("main.selectedYear",function(oldOne,newOne){
            main.chart_shown = true;
            main.netfailure = null;
            $scope.$watch("main.available_files_this_year",function(oldOneI,newOneI){
                $scope.$broadcast ('yearChangedEvent');
            });

            main.drawChart();
        });

        main.drawChart = function(){
            main.chartConfig = null;
            $scope.$on("drawChartNow", function(e, data) {
                var chartobject = chartService.getChartObject();
                main.chartConfig = chartobject;
            });
        }

            $scope.$on('netfailure',function(){
                main.netfailure = true;
            });
        main.getChildren = function(children){
            var childrens = [];
            angular.forEach(children,function(value,index){
                childrens.push({name:value.name,id:value.id});
            });

            return childrens;
        }

        main.treeCallback = function(attributes){
            main.chart_shown = false;
            main.backToGrid();
            // deselect by node reference
            ivhTreeviewMgr.deselect($scope.data.organisationUnits, main.current_id);

            var orgUnit = attributes.ivhNode;
            var name = orgUnit.name;
            $scope.selectedDistrictName = name;
            var id = orgUnit.id;
            //main.processView(orgUnit,name,id);
            main.processViewPdf(orgUnit,name,id);
            main.current_id = id;
        }


        main.getHealthProfileFromTable = function(row){
            main.openPdfFile(row);
        }

        main.getHealthProfileFromView = function(row){
            var file = {name:row.facility,id:row.id};
            main.openPdfFile(file);
        }
        main.getHealthProfileFromMap = function(row){

        }

        main.processView = function(orgUnit,name,id){
            var orgUnitWithFiles = JSON.parse(localStorage.getItem('widataset'));
            if(orgUnit.children!=null){
                var children = main.getChildren(orgUnit.children);

            }else{
                var children = [];
            }

            if(name.indexOf("Region")>=0||name.indexOf("Council")>=0){

                if(name.indexOf("Region")>=0){
                    var proposed_files= [];
                    angular.forEach(children,function(value,index){
                        if(orgUnitWithFiles.indexOf(value.id)>=0){
                            proposed_files.push({id:value.id,facility:value.name,file:value.name+"_"+value+"_"+main.selectedYear+".pdf"});
                        }
                    });
                    var correct_names=[];
                        main.Documents = proposed_files;
                }

                if(name.indexOf("Council")>=0){
                    var proposed_files= [];
                    if(orgUnitWithFiles.indexOf(orgUnit.id)>=0||orgUnitWithFiles.indexOf(id)>=0){
                        if(orgUnit==null){
                            proposed_files.push({id:orgUnit.id,facility:orgUnit.name,file:orgUnit.name+"_"+main.selectedYear+".pdf"});

                        }else{
                            proposed_files.push({id:id,facility:name,file:name+"_"+main.selectedYear+".pdf"});
                        }
                    }
                        main.Documents = proposed_files;


                }

            }else{
                //alert("select Region or council");
            }
        }



        main.processViewPdf = function(orgUnit,name,id){
            var proposed_files = [];
            var orgUnitWithFiles = JSON.parse(localStorage.getItem('widataset'));
            if(orgUnit.children!=null){
                if(orgUnit.name.indexOf('Tanzania')>=0){
                    angular.forEach(orgUnit.children,function(chValue,chIndex){
                        var grandChildren = main.getChildren(chValue.children);
                        proposed_files    = main.getOrgunitProposesdFiles(grandChildren,main.selectedYear,orgUnitWithFiles,proposed_files);

                    });
                }else{
                        var Children      = main.getChildren(orgUnit.children);
                        proposed_files    = main.getOrgunitProposesdFiles(Children,main.selectedYear,orgUnitWithFiles,proposed_files);
                }

            }else{
                var children = [];
                if(orgUnitWithFiles.indexOf(orgUnit.id)){
                proposed_files.push({id:id,facility:name,file:name+"_"+main.selectedYear+".pdf"});
                }
            }

            main.Documents = proposed_files;
        }

        main.getOrgunitProposesdFiles = function(children,selectedYear,orgUnitWithFiles,proposed_files){
            angular.forEach(children,function(value,index){
                if(orgUnitWithFiles.indexOf(value.id)>=0){
                    proposed_files.push({id:value.id,facility:value.name,file:value.name+"_"+main.selectedYear+".pdf"});
                }
            });
            return proposed_files;
        }
        main.prepareDocumentFile = function(){


        }

        main.backToGrid = function(){
            $scope.viewOpen = false;
        }
        main.openPdfFile = function(row){
            var form = {org_unit_selected:row.id,form_period:main.selectedYear};
            main.profileTitle = row.name;

            main.current_pdf_link = "uploads/"+row.name+"_"+main.selectedYear+".pdf";
            main.clickedDistrict = row.name+" "+main.selectedYear;
            $scope.viewOpen = true;
            $scope.custome_height ="not_found";

            main.previewData(form);

        }

        main.filterProfiles = function(data){

            var dataElement  = localStorage.getItem('dataElementNames');
            dataElement = JSON.parse(dataElement);
            angular.forEach(dataElement,function(valueOfDataEl,indexOfDataEl){
                main.profile[valueOfDataEl] = "";
            });

        }

        main.previewData = function(form){
            var profiledata = {};

            utilityService.getDataPreview(form).then(function(data){
                main.filterProfiles(data);

                utilityService.prepareTabledata(data).then(function(){
                    profiledata = utilityService.tableDatas;
                    angular.forEach(profiledata,function(profileValue,profileIndex){
                        if(main.profile[profileValue.name] !="undefined"){
                            main.profile[profileValue.name] = profileValue.value;
                            console.log(profileValue.name+"   =>   "+profileValue.value);
                        }
                    });

                });

            },function(response){
                console.log(data);
            });
        }



        main.getOrgunitFileStatistics = function(facility_name){
            var file_counts = 0;
            var total = 0;
            angular.forEach(main.available_files_this_year,function(value,index){
                if(value.indexOf(facility_name)>=0){
                    file_counts++;
                }
                total++;
            });
            return {orgUnit:facility_name,count:file_counts,total:total};
        }
  
        main.getOrgUnitWithAvailableFilesThisYear = function(){
            $scope.$on("drawChartNow", function(e, data) {
                var objectSeries = JSON.parse(localStorage.getItem("seriesObject"));
                main.orgUnitTable = [];
                angular.forEach(objectSeries,function(valueObject,indexObject){
                        if(valueObject.count>0){
                            main.orgUnitTable.push({name:valueObject.orgUnit,id:valueObject.id});
                        }
                });
            });
        };
        main.getOrgUnitWithAvailableFilesThisYear();


        // load org unit for tree
        $scope.customOpts = {
            onCbChange:main.treeCallback,
            defaultSelectedState:false
        }

        main.loadOrganisationUnit = function(){
            utilityService.loadOrganisationUnits().then(function(data){
                main.organisationUnitTree = data.organisationUnits;
                $scope.modifedOrgunits = utilityService.modifyOrgUnits(data.organisationUnits[0].children);

            },function(status){

            });
        }
        main.loadOrganisationUnit();

        main.getOrganisationUnit = function(){
            utilityService.getOrgUnits().then(function(data){
                $scope.data.organisationUnits = data.organisationUnits;
                main.regions = utilityService.modifyOrgUnits(data.organisationUnits[0].children);
            },function(status){

            });
        }
        main.getOrganisationUnit();


        main.modifyOrgUnits = function(rawOrgUnits){
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

        main.getPeriod = function(start_period){
            var date = new Date();
            var periods = [];
            var thisyear = date.getFullYear();
            for(var i=Number(thisyear);i>=Number(start_period);i--){
                periods.push({name:i,value:i})
            }
            return periods;
        };
        main.periods	=	main.getPeriod(main.begginingOfthePeriod);// the beggining of the period


        main.getLeftNav = function(){
            $scope.message = null;
            if(main.csv_menu){
                main.csv_menu = false;
            }else{
                main.csv_menu = true;
            }

        }
        main.getDashboard = function(){
            //main.csv_menu = false;


        }
        main.Logout = function(){
            if($cookies.get('dhis_enabled')){
                $cookies.remove('dhis_enabled');
                $cookies.remove('current_user');
            }
            $cookies.remove('dhis_enabled');
            $scope.currentLogedUser = "";
            main.logedIn = false;
            main.logedOut = true;
            main.csv_menu = false;
            main.logedSuccessMessage = null;
            main.logedFailureMessage = null;
            $location.path("/");
        }
        main.login = function(login){

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
                                main.logedIn = true;
                                main.logedOut = false;
                                main.logedSuccessMessage = "LoggedIn as "+userdata.displayName+": Connected to DHIS2.";
                                main.closeLoginForm();
                            utilityService.getDataElements().then(function(data){
                                utilityService.prepareDataElementUid(data);
                                utilityService.prepareDataElementNames(data);
                            });
                            }else{
                                $cookies.remove('dhis_enabled');
                                $cookies.remove('current_user');
                                main.logedIn = false;
                                main.logedOut = true;
                                main.logedFailureMessage = "Login Failed : invalid user name or password";
                                $scope.progressLogin = false;
                            }


                        },function(response){
                                $cookies.remove('dhis_enabled');
                                $cookies.remove('current_user');
                                main.logedIn = false;
                                main.logedOut = true;
                                main.logedFailureMessage = "Login Failed: check network connection";
                                $scope.progressLogin = false;
                        });
                },function(response){
                                $cookies.remove('dhis_enabled');
                                $cookies.remove('current_user');
                                main.logedIn = false;
                                main.logedOut = true;
                                main.logedFailureMessage = "Login Failed: check network connection";
                                $scope.progressLogin = false;
                });


        }


        main.getLoginForm = function(){
            main.logedSuccessMessage = null;
            main.logedFailureMessage = null;
            $('#modal1').openModal();

        }
        main.closeLoginForm = function(){
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
                console.log(resp);
                $scope.showProgress = false;
                if(resp.data=="UPLOAD_FAILED"){
                    $scope.message = "upload failed";
                    $scope.message_class = "failed";
                }

                if(resp.data=="UPLOAD_SUCCESS"){
                    main.getAvailableFilesThisYear();
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
                console.log(resp);
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