(function() {
    'use strict';

    angular
        .module('dhpportal')
        .config(function($httpProvider) {
            $httpProvider.defaults.withCredentials = true;
        })
        .controller('mainController', mainController);

    mainController.$inject   = ['$scope','$rootScope','$cookies','$filter','$http','$timeout','$interval','$location','$routeParams','dataService','profileService','utilityService','portalService','chartService','olData','olHelpers','mapService'];
    function mainController($scope,$rootScope,$cookies,$filter,$http,$timeout,$interval,$location,$routeParams,dataService,profileService,utilityService,portalService,chartService,olData,olHelpers,mapService) {
        var main  = this;
        var date = new Date();
         // this is the main object do not delete this variable
        $scope.dashboardObject = {displayMap:true,displayChart:false,displayTable:false};
        $scope.display_block = "display_block";
        $scope.dashboardObject.map = {};
        $scope.dashboardObject.chart = {};
        $scope.dashboardObject.table = {};
        $scope.tableCardView = 'l12';
        $scope.mapCard = false;
        $scope.submitted = 0;
        $scope.notsubmitted = 0;
        $scope.allAvailable = mapService.features.length;
        // page failure message dialogue
        $rootScope.failureMessage = null;


        // set current year
        $scope.current_year = date.getFullYear();

        // set default selected period
        $scope.selectedYear = $scope.current_year;
        $scope.selected = date.getFullYear();


        $scope.custome_height       ="default";
        $scope.begginingOfthePeriod = 2011;
        $scope.viewOpen             = false;
        $scope.csv_menu             = false;
        $scope.facilityUid          = null;

        $scope.current_id           = "m0frOspS7JY";
        $scope.data                 = {};
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
        //$scope.organisationUnitTree = [{name:'Tanzania',id:'m0frOspS7JY','children':[],'isExpanded':false,'isActive':true,'isFiltered':false,'selected':true}];
        $scope.logedSuccessMessage = null;
        $scope.logedFailureMessage = null;
        $scope.loadingDone = true;
        $scope.profile = {};
        $scope.chartConfig = false;
        $scope.netfailure = null;
        $scope.totalMales = 0;
        $scope.totalFemales = 0;


        if ( $routeParams.parentUid )
        {
            $scope.showBackButton = true;
        }

        $scope.getDHPResources = function(organisationUnit,year){
            dataService.getPopulationData(organisationUnit,year).then(function(data){
                $scope.population = {};

                $scope.population = dataService.createPopulationObject(data);

            },function(response){

            });

            var indicator = "Y1pkrlq2hWi;BlZrj2FC6bG;bzTuXoKa87E;TdxVgoa08tn;uOOJi6b0pzm;Qs5gUtaelJn";
            dataService.getIndicatorDataDistribution(indicator,organisationUnit,year).then(function(data){
                console.log("HEALTH STATUS");
                $scope.healthDistribution = dataService.createHealthStatusObject(data,year);

            },function(response){
                console.info("NO INDICTORS");
            });

            var indicator = "heyJnpx5b37;sxBx8Bone59;TvgyTWvJamX;QG9qsX5DkwG;yho46pwbbNQ;WhsP7nsuwnz;qHpMHX3KWZn;D1ajYTD7PWQ;q06r0G4AOUV";
            dataService.getIndicatorDataDelivery(indicator,organisationUnit,year).then(function(data){
                console.log("HEALTH STATUS");
                $scope.healthDelivery = dataService.createHealthStatusObject(data,year);
                console.log($scope.healthDelivery);

            },function(response){
                console.info("NO INDICTORS");
            });

            //var indicator = 'BlZrj2FC6bG;TdxVgoa08tn;TvgyTWvJamX;WhsP7nsuwnz;Y1pkrlq2hWi;bzTuXoKa87E;heyJnpx5b37;ohw1MBklYkc;qHpMHX3KWZn;sxBx8Bone59;uOOJi6b0pzm;z9ispsHeYNw;zIAxcoxZ3Pl';
            //dataService.getIndicatorDataSystem(indicator,organisationUnit,year).then(function(data){
            //    console.log("HEALTH STATUS");
            //    $scope.healthstatus = dataService.createHealthStatusObject(data,year);
            //    console.log($scope.healthstatus);
            //
            //},function(response){
            //    console.info("NO INDICTORS");
            //});


            var indicator = 'A0q2I8nTWcV:IN%3AA00%20-%20Cholera%3BA01%20-%20Typhoid%3BA01%20-%20Typhoid%20fever%20(salmonellosis)%3BA06%20-%20Dysentery%20Acute%2FChronic%3BA09%20-%20Diarrhoea%3BA15%20-%20TB%20Confirmed%3BA16%20-%20TB%20Not%20confirmed%3BA20%20-%20Plague%3BA33%20-%20Tetanus%2C%20Neonatal%3BA41%20-%20Septicaemia%3BA75%20-%20Relapsing%20Fever%20(Louse%20borne%20Typhus)%3BB05%20-%20Measles%3BB24%20-%20HIV%20and%20AIDS%3BB45%20-%20Meningitis%20Cryptococal%3BB53%20-%20Malaria%20confirmed%3BB54%20-%20Malaria%20presumptive%3BC80%20-%20Neoplasm%3BG03%20-%20Meningitis%3BG04%20-%20Encephalitis%3BG83%20-%20Acute%20Flaccid%20Paralysis%3BI50%20-%20Heart%20failure%3BJ06%20-%20Respiratory%20Infection%20Acute%20(ARI)%3BJ18%20-%20Pneumonia%3BJ45%20-%20Asthma%3BJ81%20-%20Pulmonary%20oedema%3BJ98%20-%20Pneumopathies%3BK75%20-%20Hepatitis%3BL08%20-%20Skin%20infections%3BR09%20-%20Pleurisy%20(non-Tuberculosis)%3BR50%20-%20Fever%20Chronic%20(%3E%201%20month)%3BS09%20-%20Head%20injury%3BS36%20-%20Ruptured%20spleen%3BT14%20-%20Fractures%3BT14.9%20-%20Trauma%20Other%3BT30%20-%20Burns%3BC22%20-%20Cancer%20Liver%3BC46%20-%20Kaposi%60s%20sarcoma%3BC50%20-%20Cancer%20Breast%3BC55%20-%20Cancer%20Uterine%3BC61%20-%20Cancer%20Prostate%3BC80%20-%20Tumours%20Other%20malignant%3BD48%20-%20Tumours%20Other%20non-malignant%3BE14%20-%20Diabetes%3BI10%20-%20Hypertension%3BI42%20-%20Cardiomyopathy%3BI64%20-%20Cerebrovascular%20accident%3BA80%20-%20Acute%20Flacid%20Paralysis%20(polio)%3BK25%20-%20Ulcer%2C%20gastro-duodenal%3BK29%20-%20Gastritis%3BK37%20-%20Appendicitis%3BK46%20-%20Hernia%3BK56%20-%20Intestinal%20occlusion%3BK65%20-%20Peritonitis%20(non-Tuberculosis)%3BK74%20-%20Cirrhosis%20of%20the%20liver%3BK92%20-%20Digestive%20tract%20Haemorrhages%3BM86%20-%20Bone%20infections%20(including%20osteomyelitis)%3BM89%20-%20Bone%20and%20joint%20disease%20other%3BN04%20-%20Nephrotic%20syndrome%3BN05%20-%20Glomerulonephritis%3BN15%20-%20Kidney%20infections%3BN39%20-%20Urinary%20tract%20infections%3BN94%20-%20Gynecological%20problems%3BB24%20-%20Paediatric%20AIDS%3BP05%20-%20Low%20birth%20weight%20or%20Prematurity%20Complication%3BP15%20-%20Birth%20trauma%3BP21%20-%20Neonatal%20Asphyxia%3BP22%20-%20Respiratory%20distress%3BP23%20-%20Pneumonia%3BP36%20-%20Neonatal%20Septicaemia%3BP37%20-%20Malaria%20%E2%80%93%20Neonatal%3BP54%20-%20Haemorrhage%20%E2%80%93%20Neonatal%3BP74%20-%20Dehydration%3BP78%20-%20Diarrhoea%20%E2%80%93%20Neonatal%3BP95%20-%20Stillbirth%20(fresh)%3BP95%20-%20Stillbirth%20(macerated)%3BP95%20-%20Stillbirth%3BQ05%20-%20Congenital%20hydrocephalus%20and%20spinal%20bifida%3BQ24%20-%20Congenital%20malformation%20of%20the%20heart%3BQ89%20-%20Other%20congenital%20malformation%3BR95%20-%20Sudden%20infant%20death%20syndrome%3BX49%20-%20Accidental%20poisoning%20by%20and%20exposure%20to%20noxious%20substances%3BY09%20-%20Assault%3BO06%20-%20Abortion%3BO16%2FO15%20-%20Severe%20Hypertension%20in%20pregnancy%2F%20eclampsia%3BO46%20-%20Antepartum%20Haemorrhage%3BO66%20-%20Obstructed%20Labour%3BO71%20-%20Rupture%20uterus%3BO72%20-%20Post-partum%20haemorrhage%3BO75%20-%20Unknown%20fever%3BO75%20-%20Local%20herbs%20in%20Pregnancy%3BO85%20-%20Puerperal%20Sepsis%20%2FSepticaemia%3BO98%20-%20Malaria%20in%20pregnancy%3BO99%20-%20Anaemia%20in%20Pregnancy%3BO99%20-%20Pneumonia%20in%20pregnancy%3BO99%20-%20Pulmonary%20oedema%3BO99%20-%20Meningitis%3BO99.4%20-%20Cardiomyopathy%20in%20Pregnancy%3BZ21%20-%20Asymptomatic%20HIV%3BT29%20-%20Burns%20and%20corrosions%20of%20multiple%20body%20regions';
            dataService.getIndicatorTopTenMortality(indicator,organisationUnit,year).then(function(results){
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

                $scope.toptenCauses = utilityService.getTopTenMoltalityIndicators(data,year);
            },function(response){
                console.info("NO INDICTORS");
            });

            var indicator = 'ACM4BHrKZNQ;AKeayZWILrh;BwJsDwQayqN;C2Rg2uPfbhs;CNzWVlVeOdx;CWXG9lBSI7Y;ClHcTEiVMpb;CpP8znGTTWi;DWWNT5pcrWf;EEeh0pyQISB;FkKfVoslpKi;Fuwwc9CgYUN;GQwVaLxM9Gs;GqSZits9IeK;H2R0UdSYRPn;HWZmyu3j4NX;IJAImvSE7P6;ItK93OX9wyu;KlePTLpBdWd;Kpa6sheYah0;LD4thW4OmXi;Lcj8osNjKQx;MG98iWgxXNT;MOYDHlGVOZi;MwnLlVZZJkU;NLBkuHemCAx;NRmqyxps5ZA;NSYWPEpZBuY;NlXYR3IJWCl;NwzMLHAFMSC;O9HZJ5frgiJ;PxPfeeZz5eI;Q5AQcGLeh7y;Qhi9QXHzP9b;QhpE8F5apCj;QqqAeR0wrwS;QtBqSDM3YCN;RifXFxv1lQq;RlEchOC92Yr;Rlr4Y8hOejL;RppK9y0dY08;SAD8J9zO6MF;SgeSIiqTN2l;ShxnDczlruP;SjNEefHqcz4;SxNQQBphBOS;TsLGQxidpbn;UlFUBEpJsSs;VHmWnicZtbQ;VSb3ctsTz4z;VmFo3tNlgIW;W5GuP81V3Zf;WSaSCvJTnfQ;WXuqsXyNq4K;Wa3cm09YbsP;Wyorktq1rUA;X0TXADJv7GA;Y6xpjIVTsJ7;Y7upeLGM36C;YVOid8f091G;Yut5amdi7iw;YzWIMlVnfxq;a9Pxllofrpx;anYwhLJV58B;aruodm4tcnY;avzBnVwWlV9;c4ZuqcOCyix;cGVl8WkpBTL;cUHWPSXirUl;ccIfQsrfWeL;ctT1j57B2OL;d8FSoimbeKH;eTOV59Rcv4F;eoZtkUbfrmF;f6Q9p6uSWtS;f8yQ5FUAIx0;fLjZYZB3tuB;fVzXb5qPrCp;fWq6ZXy0Uzp;fYO2JUHPdul;gNQ5NYT8SCz;hBSqV93WRL4;hO9LkFt8n2p;hufCs1tU1gs;iP9wSaCAZl5;jz1y4ru52rC;k3TGMJ3ru5y;kmpnqbSQLBl;kzj3RYX536Y;l1GL5Tmn22E;lJry1lLp3dJ;mE81BaLRP29;mMkFYcDVj3e;mcVhgPQtLLX;n611GaZn5Xr;o0KObJuu9Yu;pP6BsR5KiRM;pZr0OzykmJB;q3ELeLciuTh;qoeOTJT0x6o;s1GFhwCZaWq;s74ccDa9ZDM;sr87SW2uEmt;tM1ecc8qcsJ;tfDgtMmh9TU;uAa5OgHFwud;uqno4prZX61;uyQpafHrxLT;v6sdLtxvY1K;wULlcm4Qj5S;wwl4tRTnPEo;x5cswY9qs7m;xCl76XUXHb9;xsoXkeM69KC;yx1Ndv0hlhO;zQQFpz3JT6g;zfhmMA4HeJn;ziUz3NmWftW;zqaHIXl6j7c';
            dataService.getIndicatorTopTenAdmissions(indicator,organisationUnit,year).then(function(results){
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

                $scope.toptenAdmission = utilityService.getTopTenAdmissionIndicators(data,year);
            },function(response){
                console.info("NO INDICTORS");
            });


        }


        $scope.admin = function(){
            window.location.href = "#/admin";
        }

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
        $scope.downloadCSV = function(){
            var array = []
            angular.forEach($scope.dashboardObject.table.tableObject,function(value){

                if(doesFileExist('uploads/'+value.name)){
                    array.push({profile:value.name});
                }else{

                }

            });
            return array;
        }

        function doesFileExist(urlToFile)
        {
            var xhr = new XMLHttpRequest();
            xhr.open('HEAD', urlToFile, false);
            xhr.send();

            if (xhr.status == "404") {
                return false;
            } else {
                console.log('file doesnot exist');
                return true;
            }
        }

        $scope.getCSVHeader = function(){
            return ["Submitted District Health Profile - "+$scope.selectedYear]
        }

        /**
         *
         * */

        $scope.filename = "test";
        $scope.getArray = [{a: 1, b:2}, {a:3, b:4}];

        $scope.getHeader = function () {return ["A", "B"]};


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

        var formerOrganisationUnitObject = [];
        localStorage.setItem('orgUnitNumber',0);
        $scope.selectedCallback = function(item, selectedItems){

            var orgunitNumber = localStorage.getItem('orgUnitNumber');

            if ( orgunitNumber != selectedItems.length  )
            {

                $scope.registerChanges($scope.selectedYear,selectedItems);

                localStorage.setItem('orgUnitNumber',selectedItems.length);
            }else{



            }


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
                dataElement  = JSON.parse(dataElement);
            angular.forEach(dataElement,function(valueOfDataEl,indexOfDataEl){
                $scope.profile[valueOfDataEl] = "";
            });

        }

        $scope.treeWithSelectedDistrict = function(uid){

            var orgUnit = $scope.organisationUnitTree;
            if($scope.organisationUnitTree){

                    angular.forEach($scope.organisationUnitTree[0].children,function(chValue,chIndex){

                        angular.forEach(chValue.children,function(value,index){

                            if(value.id==uid){
                                orgUnit[0].children[chIndex].children[index].selected  = true;
                                orgUnit[0].children[chIndex].children[index].isActive  = true;
                                $scope.drawOrgUnitTree(null);
                            }

                        });


                    });

            }
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


            angular.forEach($scope.objectsselected,function(value,index){
                orgString+=value.id+";";

                if(orgString.length>0){
                    $scope.orgunitString = orgString.substring(0, orgString.length - 1);
                }
            });

        }

        /// sort organisation unit
        function sortingOrUnit(parentOrg){

            angular.forEach(parentOrg,function(parentOrgUnit,index){
                if(parentOrg[index].children) {
                    parentOrg[index].children = $filter('orderBy')(parentOrg[index].children, 'name');
                    angular.forEach(parentOrg[index].children,function (child,indexc) {
                        parentOrg[index].children[indexc].children=$filter('orderBy')(parentOrg[index].children[indexc].children, 'name');
                    });
                }
            });

            return parentOrg;
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

                        $scope.registerChanges($scope.selectedYear,$scope.selectedItems);
                    }

                    // callback for organisation unit selection from tree
                        var monitor = 0;
                        //$scope.$watch('selectedItems',function(newvalue,oldvalue){
                        //
                        //    if(monitor<1){
                        //        $scope.registerChanges($scope.selectedYear,newvalue);
                        //        monitor++
                        //    }else{
                        //        monitor = 0;
                        //    }
                        //
                        //});



                },function(status){

                    console.warn("organisation unit can't load internal server or network error")
                });



            },function(failure){

                $rootScope.failureMessage = " remote authentication failure try to reload the portal";
            })


        }


        $scope.loadOrganisationUnit();


        $scope.registerChanges = function(newperiod,newvalue){
                // hide all views and show loading image

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

                $rootScope.failureMessage = null;
                $http({method:'GET',url:url,dataType:'json',catche:true,isModified:true}).then(function(analytics){

                var analytics_data = analytics.data;

                /// Dealing with map

                mapService.renderMap($scope.selectedYear,$scope.orgunitString).then(function(orgunits){
                    $scope.dashboardObject.map.layers = null;
                    if (typeof orgunits.data == "object" ){
                        angular.extend($scope.dashboardObject.map,mapService.prepareMapObject(orgunits.data,analytics_data));
                        $scope.submitted = mapService.submitted;
                        $scope.notsubmitted = mapService.totalDistricts - mapService.submitted;
                    }else{

                    }

                    $scope.dashboardObject.chart.chartObject = mapService.chartObject;
                    $scope.dashboardObject.table.tableObject = mapService.tableObject;

                    olData.getMap().then(function(map) {
                        var previousFeature;
                        var overlay = new ol.Overlay({
                            element: document.getElementById('districtbox'),
                            positioning: 'top-right',
                            offset: [100, -100],
                            position: [100, -100]
                        });
                        var overlayHidden = true;
                        // Mouse click function, called from the Leaflet Map Events
                        $scope.lastFeature = null;
                        $scope.$on('openlayers.layers.geojson.mousemove', function(event, feature, olEvent) {



                            $scope.$apply(function($scope) {

                                $scope.selectedDistrictHover = feature ? mapService.features[feature.getId()] : '';
                                if(feature) {
                                    $scope.selectedDistrictHover = feature ? mapService.features[feature.getId()] : '';
                                }




                            });

                            if (!feature) {
                                $scope.selectedDistrictHover = null;
                                map.removeOverlay(overlay);
                                overlayHidden = true;
                                return;
                            } else if (overlayHidden) {
                                map.addOverlay(overlay);
                                overlayHidden = false;
                            }
                            overlay.setPosition(map.getEventCoordinate(olEvent));
                            if (feature) {
                                feature.setStyle(olHelpers.createStyle({
                                    fill: {
                                        color: mapService.features[feature.getId()].color,
                                        opacity:0.4
                                    },
                                    stroke: {
                                        //color: '#A3CEC5',
                                        color: '#D0D0D0',
                                        width:3

                                    }
                                }));
                                if (previousFeature && feature !== previousFeature) {
                                    previousFeature.setStyle(mapService.getStyle(previousFeature));
                                }
                                previousFeature = feature;
                            }
                        });

                        $scope.$on('openlayers.layers.geojson.click', function(event, feature, olEvent) {

                            $scope.$apply(function($scope) {
                                $scope.selectedDistrict = feature ? mapService.features[feature.getId()] : '';
                                if(feature) {
                                    // looping throught indicator types
                                    $scope.selectedDistrict = feature ? mapService.features[feature.getId()] : '';

                                    $scope.treeWithSelectedDistrict(feature.getId());
                                    var indicators = [
                                        {id:"zIAxcoxZ3Pl",name:"EAC: BCG dose given under one year"},
                                        {id:"Y1pkrlq2hWi",name:"Infant Mortality Rate"},
                                        {id:"BlZrj2FC6bG",name:"Neonatal Mortality Rate"},
                                        {id:"WhsP7nsuwnz",name:"PENTA 3 vaccination coverage children under 1 year"},
                                        {id:"TvgyTWvJamX",name:"Proportion of pregnant mothers who received 2 doses IPT"},
                                        {id:"TdxVgoa08tn",name:"ANC HIV prevalence (15-24 years)"},
                                        {id:"sxBx8Bone59",name:"OPD Attendance per capita"},
                                        {id:"uOOJi6b0pzm",name:"Low birth weight among new-borns"},
                                        {id:"heyJnpx5b37",name:"OPV 3 Vaccination Coverage"},
                                        {id:"qHpMHX3KWZn",name:"Proportion of laboratory confirmed malaria cases among all OPD visits"},
                                        {id:"z9ispsHeYNw",name:"Malaria Death Rate <5"},
                                        {id:"ohw1MBklYkc",name:"PlanRep Implemented Skilled Human Resources Recruited"}
                                    ]
                                    $scope.selectedDistrictName = $scope.selectedDistrict.name;
                                }
                            });

                            if (!feature) {
                                map.removeOverlay(overlay);
                                overlayHidden = true;
                                return;
                            } else if (overlayHidden) {
                                map.addOverlay(overlay);
                                overlayHidden = false;
                            }
                            overlay.setPosition(map.getEventCoordinate(olEvent));
                            if (feature) {
                                feature.setStyle(olHelpers.createStyle({
                                    fill: {
                                        color:mapService.features[feature.getId()].color,
                                        opacity:0.5
                                    }
                                }));
                                if (previousFeature && feature !== previousFeature) {
                                    previousFeature.setStyle(getStyle(previousFeature));
                                }
                                previousFeature = feature;
                            }
                        });

                        $scope.$on('openlayers.layers.geojson.featuresadded', function(event, feature, olEvent) {
                            $scope.$apply(function($scope) {
                                if(feature) {
                                    $scope.id = feature.getId();
                                    $scope.selectedDistrict = feature ? mapService.features[feature.getId()]: '';
                                }
                            });

                        });


                    });

                },function(response){
                    $rootScope.failureMessage = "failed to load resources, check network connection";
                });


                /// Dealing with profile data
                    $scope.prepareTabledataFromAnalytics(analytics_data);

                    $scope.getDHPResources($scope.orgunitString,$scope.selectedYear);



                },function(failure){
                    $rootScope.failureMessage = "failed to load resources, check network connection";
            });


                var orgNames = ""
                angular.forEach(newvalue,function(value){
                    orgNames += value.name+",";
                });

                $scope.orgUnitNames = orgNames.substring(0, orgNames.length - 1);



        }

        $scope.prepareTabledataFromAnalytics = function(data){

            $scope.profile = {};

            if ( data.metaData )
            {
                var dataelements = data.metaData.dx;
                var names        = data.metaData.names;
                var ou           = data.metaData.ou;
                var rows         = data.rows;

                angular.forEach(dataelements,function(value,index){

                    angular.forEach(rows,function(rowValue,rowIndex){
                        if(rowValue[0] == value){
                            $scope.profile[names[value]] = rowValue[2];
                        }
                    });

                });
            }


        }

        $scope.getOrganisationUnit = function(){

            $rootScope.failureMessage = null;
            utilityService.getOrgUnits().then(function(data){

                if ( data.organisationUnits )
                {
                    $scope.data.organisationUnits = sortingOrUnit(data.organisationUnits);
                    $scope.regions = utilityService.modifyOrgUnits(data.organisationUnits[0].children);
                }

            },function(status){
                $rootScope.failureMessage = "failed to load resources, check network connection";
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

        $scope.userLogin = function(login){

            $scope.progressLogin = true;
            var username = login.dhis_login_username;
            var password = login.dhis_login_password;
            $rootScope.failureMessage = null;
                utilityService.login(username,password).then(function(data){
                    $scope.progressLogin = false;

                        utilityService.getUserDetails().then(function(userdata){
                            if(typeof(userdata)=="object"){
                                $cookies.put('dhis_enabled', 'logedIn');
                                $cookies.put('current_user', userdata.displayName);
                                $scope.currentLogedUser = $cookies.get('current_user');
                                $scope.progressLogin = false;
                                $scope.logedIn = true;
                                $scope.logedOut = false;
                                $scope.logedSuccessMessage = "LoggedIn as "+userdata.displayName+": Connected to DHIS2.";
                                $scope.closeLoginForm();

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
                            $rootScope.failureMessage = "failed to login, check network connection";
                        });
                },function(response){
                    $rootScope.failureMessage = "failed to login, check network connection";
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
            $('#login_modal').openModal();

        }


        $scope.userLogout = function(){
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
            window.location.href = "#/home";
            $scope.currentLogedUser    = null;

        }


        $scope.closeLoginForm = function(){
            $('#login_modal').closeModal();
            $scope.progressLogin = null;
            $scope.logedSuccessMessage = null;
            $scope.logedFailureMessage = null;
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
            $rootScope.failureMessage = null;
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
                $rootScope.failureMessage = "Upload failure";
            }, function (evt) {
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
