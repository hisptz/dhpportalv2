/**
 * Created by kelvin on 1/10/16.
 */
angular.module("dhpportal")

    .config(function($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.headers.post["Content-Type"] = "application/json";
    })
    .controller("dataCtrl",function ($rootScope,$scope,$http,$routeParams,chartsManager,portalService,$timeout) {
        //displaying loading during page change
        $rootScope.$on("$routeChangeStart",
            function (event, current, previous, rejection) {
                $rootScope.showLoader = true;
            });
        $rootScope.$on("$routeChangeSuccess",
            function (event, current, previous, rejection) {
                $rootScope.showLoader = false
            });



            $rootScope.showProgressMessage = false;
            //find dataset uid
            $scope.dataSetId = $routeParams.uid;
            //pull dataset details
            $scope.datasetUrl = portalService.base+"api/dataSets/"+$scope.dataSetId+".json?fields=id,name,shortName,dataElements[id,name]";
            //$scope.datasetUrl = "dataset.json";

            $scope.lastCard = function(){
                $scope.loadingImage = true;
                $rootScope.progressMessage = "Preparing form details ...";
                $rootScope.showProgressMessage = true;
                var base = portalService.base;
                $.post( base + "dhis-web-commons-security/login.action?authOnly=true", {
                    j_username: "portal", j_password: "Portal123"
                },function(){
                    $http.get($scope.datasetUrl).success(function(data){
                        $scope.CurrentSection = data.name.replace("NACP_", " ").replace("HMIS_", " ").replace("NTLP_", " ");
                        $scope.dataSetName  = data.shortName;
                            $scope.dataserObject = data;
                            var dataElements = $scope.prepareDataElements(data);
                            $rootScope.progressMessage = "Getting form data ...";
                        if($scope.selectedOrgUnit === 'm0frOspS7JY'){
                            var dataUrl = portalService.base+"api/analytics.json?dimension=dx:"+dataElements+"&dimension=ou:LEVEL-2;"+ $scope.selectedOrgUnit +"&filter=pe:" + $scope.selectedPeriod + "&displayProperty=NAME"
                        }else{
                            var dataUrl = portalService.base+"api/analytics.json?dimension=dx:"+dataElements+"&dimension=ou:LEVEL-3;"+ $scope.selectedOrgUnit +"&filter=pe:" + $scope.selectedPeriod + "&displayProperty=NAME"
                        }
                            //var dataUrl = "datasetData.json";
                            $http.get(dataUrl).success(function (metaData){
                                $rootScope.showProgressMessage = false;
                                $scope.metaData = metaData;
                                $scope.table = chartsManager.drawChart(metaData,'ou',[],'dx',[],'none',"",data.shortName,'table');
                                $scope.loadingImage = false;
                                $scope.rows = 'ou';
                            }).error(function(error){
                                $rootScope.progressMessage = "Error during getting data...";
                                $timeout( function(){ $rootScope.showProgressMessage = false; }, 10000);
                            });
                    });
                    //$http.get($scope.datasetUrl).success(function (dataset) {
                    //    $scope.dataSetName  = dataset.shortName;
                    //    $scope.dataserObject = dataset;
                    //    var dataElements = $scope.prepareDataElements(dataset);
                    //    $rootScope.progressMessage = "Getting form data ...";
                    //    var dataUrl = portalService.base+"api/analytics.json?dimension=dx:"+dataElements+"&dimension=ou:LEVEL-2;"+ $scope.selectedOrgUnit +"&filter=pe:" + $scope.selectedPeriod + "&displayProperty=NAME"
                    //    //var dataUrl = "datasetData.json";
                    //    $http.get(dataUrl).success(function (metaData){
                    //        $rootScope.showProgressMessage = false;
                    //        $scope.metaData = metaData;
                    //        $scope.table = chartsManager.drawChart(metaData,'ou',[],'dx',[],'none',"",dataset.shortName,'table');
                    //        $scope.loadingImage = false;
                    //        $scope.rows = 'ou';
                    //    }).error(function(error){
                    //        $rootScope.progressMessage = "Error during getting data...";
                    //        $timeout( function(){ $rootScope.showProgressMessage = false; }, 10000);
                    //    });
                    //});
                });

            };

            //switch column and rows
            $scope.switchRows = function(){
                if($scope.rows === 'ou'){
                    $scope.table = chartsManager.drawChart($scope.metaData,'dx',[],'ou',[],'none',"",$scope.dataSetName,'table');
                    $scope.rows = "dx";
                }else if($scope.rows === 'dx'){
                    $scope.table = chartsManager.drawChart($scope.metaData,'ou',[],'dx',[],'none',"",$scope.dataSetName,'table');
                    $scope.rows = "ou";
                }

            };

            //prepare dataelements and indicators for sending on analytics
            $scope.prepareDataElements = function(datasetObject){
                var dataElements = [];
                angular.forEach(datasetObject.dataElements,function(dataelement){
                    if(dataElements.indexOf(dataelement.id) == -1){
                        dataElements.push(dataelement.id);
                    }
                });
                return dataElements.join(";");
            };

            $scope.downloadExcelTotal = function(){

                if($scope.selectedOrgUnit == "m0frOspS7JY"){
                    var lastUrl=portalService.base+"api/analytics.cvs?dimension=dx:"+$scope.prepareDataElements($scope.dataserObject)+"&dimension=ou:LEVEL-2;m0frOspS7JY&filter=pe:"+$scope.selectedPeriod+"&displayProperty=NAME&tableLayout=true&columns=dx&rows=ou";
                }else{
                    var lastUrl=portalService.base+"api/analytics.cvs?dimension=dx:"+$scope.prepareDataElements($scope.dataserObject)+"&dimension=ou:LEVEL-3;"+$scope.selectedOrgUnit+"&filter=pe:"+$scope.selectedPeriod+"&displayProperty=NAME&tableLayout=true&columns=dx&rows=ou"
                }
                $rootScope.progressMessage = "Downloading Excel ...";
                $rootScope.showProgressMessage = true;
                $http.get(lastUrl,{'Content-Type': 'application/octet-stream'}).success(function(data){
                    $rootScope.showProgressMessage = false;
                    var a = document.createElement('a');
                    var blob = new Blob([data]);
                    a.href = window.URL.createObjectURL(blob);
                    a.download = "data.xls";
                    a.click();
                }).error(function(error){
                    $rootScope.progressMessage = "Error during downloading Excel ...";
                    $timeout( function(){ $rootScope.showProgressMessage = false; }, 10000);
                });
            };

            $rootScope.firstClick = function(){
                $scope.lastCard();
            };
            $scope.firstClick();


        $scope.getPeriodName = function(period){
            if(period.length == 4){
                return period;
            }else if(period.length == 6){
                var year = period.substring(0,4);
                var quater = period.substring(4,6);
                var names = "";
                if(quater == "Q4"){
                    names = "Oct - Dec "+year;
                }else if(quater == "Q3"){
                    names = "July - Sept "+year;
                }else if(quater == "Q2"){
                    names = "Apr - Jun "+year;
                }else if(quater == "Q1"){
                    names = "Jan - Mar "+year;
                }
                return names;
            }
        };

        $scope.getOrgUnitName = function(uid){
            var orgUnits=[{"id":"YtVMnut7Foe","name":"Arusha Region"},{"id":"acZHYslyJLt","name":"Dar Es Salaam Region"},{"id":"Cpd5l15XxwA","name":"Dodoma Region"},{"id":"MAL4cfZoFhJ","name":"Geita Region"},{"id":"sWOWPBvwNY2","name":"Iringa Region"},{"id":"Crkg9BoUo5w","name":"Kagera Region"},{"id":"DWSo42hunXH","name":"Katavi Region"},{"id":"RD96nI1JXVV","name":"Kigoma Region"},{"id":"lnOyHhoLzre","name":"Kilimanjaro Region"},{"id":"VMgrQWSVIYn","name":"Lindi Region"},{"id":"qg5ySBw9X5l","name":"Manyara Region"},{"id":"vYT08q7Wo33","name":"Mara Region"},{"id":"A3b5mw8DJYC","name":"Mbeya Region"},{"id":"Sj50oz9EHvD","name":"Morogoro Region"},{"id":"bN5q5k5DgLA","name":"Mtwara Region"},{"id":"hAFRrgDK0fy","name":"Mwanza Region"},{"id":"qarQhOt2OEh","name":"Njombe Region"},{"id":"yyW17iCz9As","name":"Pwani Region"},{"id":"vAtZ8a924Lx","name":"Rukwa Region"},{"id":"ZYYX8Q9SGoV","name":"Ruvuma Region"},{"id":"EO3Ps3ny0Nr","name":"Shinyanga Region"},{"id":"IgTAEKMqKRe","name":"Simiyu Region"},{"id":"LGTVRhKSn1V","name":"Singida Region"},{"id":"kZ6RlMnt2bp","name":"Tabora Region"},{"id":"vU0Qt1A5IDz","name":"Tanga Region"}];
            var name = "";
            if(uid === 'm0frOspS7JY'){
                name = "MOH - Tanzania"
            }else{
                angular.forEach(orgUnits,function(value){

                    if(uid === value.id){
                        console.log(uid +"==="+ value.id)
                        name = value.name;
                    }
                })
            }
            return name;
        };

    });