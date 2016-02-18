/**
 * Created by leo on 10/21/15.
 */


angular.module("dhpportal")
    .config(function($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    })
    .controller("dashboardCtrl",function ($rootScope,$scope,$http,$location,$timeout,olData,olHelpers,shared,portalService) {

        $scope.linkValue="census"
        $scope.activateLink = function(linkValue){
            $timeout(function(){
            $scope.linkValue = linkValue;
            },2000);
        }
        $rootScope.periodType = 'years';
         //displaying loading during page change
        $rootScope.$on("$routeChangeStart",
            function (event, current, previous, rejection) {
                $rootScope.showLoader = true;
            });
        $rootScope.$on("$routeChangeSuccess",
            function (event, current, previous, rejection) {
                $rootScope.showLoader = false;

            });
        $scope.cards = {};
        $scope.data = {};
        $rootScope.selectedOrgUnit = "m0frOspS7JY";
        $rootScope.selectedPeriod = "2014";
        $scope.selectedOrgUnitLevel = "2";
        $scope.population = {};
        $scope.population.displayTable = false;
        $scope.icons=[
            {name:'table',image:'table.jpg',action:''},
            {name:'bar',image:'bar.png',action:''},
            {name:'line',image:'line.png',action:''},
            {name:'combined',image:'combined.jpg',action:''},
            {name:'column',image:'column.png',action:''},
            {name:'area',image:'area.jpg',action:''},
            {name:'pie',image:'pie.png',action:''}
        ];
        $scope.baseUrl  = portalService.base;
            $scope.prepareData = function(jsonObject){
            var structure = {};
            var data = [];
            var elements = [];
            elements.push({'name':'< 1','uid':'h8JRv8POdfy'},
                {'name':'1 - 4','uid':'LBipXEMD6mq'},
                {'name':'5 - 14','uid':'aZcKJ9XxvaF'},
                {'name':'15 - 49','uid':'FfN1mqXvpR7'},
                {'name':'50 - 60','uid':'HKU7NijIEIH'});

            angular.forEach(jsonObject.metaData.ou,function(region){
                data.push({'name':jsonObject.metaData.names[region],'id':region});
            });
            structure.regions = data;
            structure.elements = elements;
            return structure;

        };

        $scope.data.chartType = 'column';
        $scope.displayTable = false;
        $scope.changeChart = function($event,type){
            $scope.population.displayTable = false;
            var parent = angular.element($event.target).parent().parent().parent().prev('div');
            $scope.showReport = true;
            if(type == 'table'){

                parent.css('overflow','scroll');
                $scope.population.displayTable = true;
                $scope.data.chartType = 'table';
            }
            else{
                parent.removeAttr( 'style' );
                $scope.population.displayTable = false;
                $scope.data.chartType = type;
            }
            $scope.prepareSeries();
        };

        $scope.downloadExcel1 = function(){
            var base = portalService.base;
            $rootScope.currentDownloading = true;

            $.post( base + "dhis-web-commons-security/login.action?authOnly=true", {
                j_username: "portal", j_password: "Portal123"
            },function(){
                var url = "";
                if($scope.selectedOrgUnit == "m0frOspS7JY"){
                    url = portalService.base+"api/analytics.csv?dimension=dx:ykShMtNgDB1&dimension=Cow9nZikDgD:LBipXEMD6mq;FfN1mqXvpR7;aZcKJ9XxvaF;HKU7NijIEIH;h8JRv8POdfy&dimension=ou:LEVEL-2;"+$scope.selectedOrgUnit+"&filter=pe:"+$scope.selectedPeriod+"&displayProperty=NAME&outputIdScheme=NAME";
                }else{
                    url = portalService.base+"api/analytics.csv?dimension=dx:ykShMtNgDB1&dimension=Cow9nZikDgD:LBipXEMD6mq;FfN1mqXvpR7;aZcKJ9XxvaF;HKU7NijIEIH;h8JRv8POdfy&dimension=ou:LEVEL-3;"+$scope.selectedOrgUnit+"&filter=pe:"+$scope.selectedPeriod+"&displayProperty=NAME&outputIdScheme=NAME";
                }
                $http.get(url,{'Content-Type': 'application/csv;charset=UTF-8'}).success(function(data){
                    var a = document.createElement('a');
                    var blob = new Blob([data]);
                    a.href = window.URL.createObjectURL(blob);
                    a.download = "data.csv";
                    a.click();
                });
            });
        };
        $scope.downloadPopulationExcel = function(card){
            var base = portalService.base;
            $rootScope.currentDownloading = true;

            $.post( base + "dhis-web-commons-security/login.action?authOnly=true", {
                j_username: "portal", j_password: "Portal123"
            },function(){
                var url = "";

                if($scope.selectedOrgUnit == "m0frOspS7JY"){
//                    http://139.162.204.124/dhis/api/analytics.csv?dimension=dx:ykShMtNgDB1&dimension=pe:2014&dimension=ou:LEVEL-2;m0frOspS7JY&displayProperty=NAME&outputIdScheme=NAME
                    url = portalService.base+"api/analytics.csv?dimension=dx:"+card.data+"&dimension=ou:LEVEL-1;LEVEL-2;"+$scope.selectedOrgUnit+"&filter=pe:"+$scope.selectedPeriod+"&displayProperty=NAME&outputIdScheme=NAME";
                }else{
                    url = portalService.base+"api/analytics.csv?dimension=dx:"+card.data+"&dimension=ou:LEVEL-2;LEVEL-3;"+$scope.selectedOrgUnit+"&filter=pe:"+$scope.selectedPeriod+"&displayProperty=NAME&outputIdScheme=NAME";
                }

                $http.get(url,{'Content-Type': 'application/csv;charset=UTF-8'}).success(function(data){
                    var a = document.createElement('a');
                    var blob = new Blob([data]);
                    a.href = window.URL.createObjectURL(blob);
                    a.download = "data.csv";
                    a.click();
                });
            })

        };

        $scope.prepareSeries = function(){
            $scope.chartConfig.loading = true;
            var base = portalService.base;
            $.post( base + "dhis-web-commons-security/login.action?authOnly=true", {
                j_username: "portal", j_password: "Portal123"
            },function(){
                $scope.chartConfig.title.text = "POPULATION BY AGE GROUP";
                $scope.area = [];
                if($scope.selectedOrgUnit == "m0frOspS7JY"){

                    $scope.url = portalService.base+"api/analytics.json?dimension=Cow9nZikDgD:LBipXEMD6mq;FfN1mqXvpR7;aZcKJ9XxvaF;HKU7NijIEIH;h8JRv8POdfy&dimension=dx:ykShMtNgDB1&dimension=ou:LEVEL-2;"+$scope.selectedOrgUnit+"&filter=pe:"+$scope.selectedPeriod+"&displayProperty=NAME";
                }else{
                    $scope.url = portalService.base+"api/analytics.json?dimension=Cow9nZikDgD:LBipXEMD6mq;FfN1mqXvpR7;aZcKJ9XxvaF;HKU7NijIEIH;h8JRv8POdfy&dimension=dx:ykShMtNgDB1&dimension=ou:LEVEL-3;"+$scope.selectedOrgUnit+"&filter=pe:"+$scope.selectedPeriod+"&displayProperty=NAME";
                }

                $http.get($scope.url).success(function(data){
                    var useThisData = $scope.prepareData(data);
                    angular.forEach(useThisData.regions,function(value){
                        $scope.area.push(value.name);
                    });
                    $scope.subCategory = useThisData.elements;
                    $scope.chartConfig.xAxis.categories = $scope.area;

                    $scope.normalseries = [];
                    if($scope.data.chartType == "pie"){
                        delete $scope.chartConfig.chart;
                        var serie = [];
                        angular.forEach($scope.subCategory,function(value){
                            angular.forEach(useThisData.regions,function(val){
                                var number = $scope.getDataFromUrl(data.rows,val.id,value.uid);

                                serie.push({name: value.name+" - "+ val.name , y: parseInt(number)})
                            });
                        });
                        $scope.normalseries.push({type: $scope.data.chartType, name:$scope.UsedName , data: serie,showInLegend: true,
                            dataLabels: {
                                enabled: false
                            } })
                        $scope.chartConfig.series = $scope.normalseries;
                    }
                    else if($scope.data.chartType == "combined"){
                        delete $scope.chartConfig.chart;
                        var serie1 = [];
                        angular.forEach($scope.subCategory,function(value){
                            var serie = [];

                            angular.forEach(useThisData.regions,function(val){
                                var number = $scope.getDataFromUrl(data.rows,val.id,value.uid);
                                serie.push(parseInt(number));
                                serie1.push({name: value.name+" - "+ val.name , y: parseInt(number) })
                            });
                            $scope.normalseries.push({type: 'column', name: value.name, data: serie});
                            $scope.normalseries.push({type: 'spline', name: value.name, data: serie});
                        });

                        $scope.chartConfig.series = $scope.normalseries;
                    }
                    else if($scope.data.chartType == 'table'){
                        $scope.table ={}
                        $scope.table.headers = [];
                        $scope.table.colums =[];
                        angular.forEach($scope.subCategory,function(value){
                            var serie = [];
                            $scope.table.headers.push(value.name);
                        });
                        angular.forEach(useThisData.regions,function(val){
                            var seri = [];
                            angular.forEach($scope.subCategory,function(value){
                                var number = $scope.getDataFromUrl(data.rows,val.id,value.uid);
                                seri.push({name:value.name,value:parseInt(number)});
                            });
                            $scope.table.colums.push({name:val.name,values:seri});
                        });
                        console.log($scope.table.colums);
                    }
                    else{
                        delete $scope.chartConfig.chart;
                        angular.forEach($scope.subCategory,function(value){
                            var serie = [];
                            angular.forEach(useThisData.regions,function(val){
                                var number = $scope.getDataFromUrl(data.rows,val.id,value.uid);
                                serie.push(number);
                            });
                            $scope.normalseries.push({type: $scope.data.chartType, name: value.name, data: serie})
                        });
                        $scope.chartConfig.series = $scope.normalseries;
                    }
                    $scope.chartConfig.loading = false
                });

            });
        };


        //drawing some charts
        $scope.chartConfig = {
            title: {
                text: 'POPULATION BY AGE GROUP'
            },
            xAxis: {
                categories: [],
                labels:{
                    rotation: -45,
                    style:{ "color": "#000000", "fontWeight": "bold" }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Population'
                },labels:{
                    style:{ "color": "#000000", "fontWeight": "bold" }
                }

            },
            labels: {
                items: [{
                    html: 'Population',
                    style: {
                        left: '50px',
                        top: '18px',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                    }
                }]
            },
            series: []
        };
        $scope.getDataFromUrl  = function (arr,ou,de){
            var num = 0;
            $.each(arr,function(k,v){
                if(v[2] == ou && v[1] == de ){
                    num = parseInt(v[3])
                }
            });
            return num;
        }
        ////////////////////////////////////////////////////////////////////
        ////////////// Total population card/////////////////////////////
        ///////////////////////////////////////////////////////////////
        $scope.cards.popu = [{
            title:'TOTAL POPULATION',
            description:'Maelezo ya total population',
            cardClass:"col s12 m12",
            data:'ykShMtNgDB1',
            icons:[
                {name:'table',image:'table.jpg',action:''},
                {name:'bar',image:'bar.png',action:''},
                {name:'line',image:'line.png',action:''},
                {name:'combined',image:'combined.jpg',action:''},
                {name:'column',image:'column.png',action:''},
                {name:'area',image:'area.jpg',action:''},
                {name:'pie',image:'pie.png',action:''},
                {name:'map',image:'map.jpg',action:''}
            ],
            dataSource:'',
            size:'small',
            displayTable:false,
            displayMap:false,
            chart:'bar',
            chartObject:{
                title: {
                    text: 'Combination chart'
                },
                xAxis: {
                    categories: [],
                    labels:{
                        rotation: -70,
                        style:{ "color": "#000000", "fontWeight": "normal" }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: ''
                    },labels:{
                        style:{ "color": "#000000", "fontWeight": "bold" }
                    }
                },
                labels: {
                    items: [{
                        html: 'doses',
                        style: {
                            left: '50px',
                            top: '18px',
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                        }
                    }]
                },
                series: []
            }

        }]

        $scope.preparePopData = function(jsonObject){
            var data = [];
            //data.push({'name':jsonObject.metaData.names[$rootScope.selectedOrgUnit],'id':$rootScope.selectedOrgUnit,'value':getDataFromUrl(jsonObject.rows,$rootScope.selectedOrgUnit)});
            $scope.totalPop = numberWithCommas(getPopDataFromUrl(jsonObject.rows,$rootScope.selectedOrgUnit));
            angular.forEach(jsonObject.metaData.ou,function(region){
                if(region != $rootScope.selectedOrgUnit ){
                    data.push({'name':jsonObject.metaData.names[region],'id':region,'value':getPopDataFromUrl(jsonObject.rows,region)});
                }
            });
            return data;

        };

    $scope.data.chartType = 'column';
        $scope.displayTable = false;
        $scope.changePopChart = function($event,type,card){
            var parent = angular.element($event.target).parent().parent().parent().prev('div');
              card.displayTable = false;

            $scope.showReport = true;
            if(type == 'table'){
                parent.css('overflow','scroll');
                card.displayTable = true;
                card.displayMap = false;
                card.chart = 'table';
                $scope.data.chartType = 'table';
            }else if(type == 'map'){
                card.displayMap = true;
                card.displayTable = false;
                card.chart = 'map';
                $scope.data.chartType = 'map';
            }
            else{
                parent.removeAttr( 'style' );
                card.displayMap = false;
                card.displayTable = false;
                card.chart = type;
                $scope.data.chartType = type;
            }
            $scope.preparePopSeries(card,$scope.data.chartType);
        };

        $scope.downloadExcel = function(id){
//            var base = portalService.base;
            $.post( $scope.baseUrl + "dhis-web-commons-security/login.action?authOnly=true", {
                j_username: "portal", j_password: "Portal123"
            },function(){
                var url = "";
                if($scope.selectedOrgUnit == "m0frOspS7JY"){
                    url = $scope.baseUrl+"api/analytics.csv?dimension=dx:"+id+"&dimension=pe:"+$scope.selectedPeriod+"&dimension=ou:LEVEL-1;LEVEL-2;"+$scope.selectedOrgUnit+"&displayProperty=NAME&tableLayout=true&columns=dx&rows=pe;ou";
                }else{

                    url = $scope.baseUrl+"api/analytics.csv?dimension=dx:"+id+"&dimension=pe:"+$scope.selectedPeriod+"&dimension=ou:LEVEL-2;LEVEL-3;"+$scope.selectedOrgUnit+"&displayProperty=NAME&tableLayout=true&columns=dx&rows=pe;ou";
                }
                $http.get(url,{'Content-Type': 'application/csv;charset=UTF-8'}).success(function(data){
                    var a = document.createElement('a');
                    var blob = new Blob([data]);
                    a.href = window.URL.createObjectURL(blob);
                    a.download = "data.xls";
                    a.click();
                });
            });
        }

        $scope.preparePopSeries = function(cardObject,chart){
            cardObject.chartObject.loading = true;
            var base = portalService.base;
            $.post(
                    $scope.baseUrl + "dhis-web-commons-security/login.action?authOnly=true", {
                j_username: "portal", j_password: "Portal123"
            }
                ,function(){
                if(chart == 'table'){
                    cardObject.displayTable = true;
                    cardObject.displayMap = false;
                }else if(chart == 'map'){
                    cardObject.displayMap = true;
                    cardObject.displayTable = false;
                }
                else{
                    cardObject.displayMap = false;
                    cardObject.displayTable = false;
                }

                cardObject.chartObject.yAxis.title.text = cardObject.title.toLowerCase();
                if($scope.selectedOrgUnit == "m0frOspS7JY"){
                    $scope.url = $scope.baseUrl+"api/analytics.json?dimension=dx:"+cardObject.data+"&dimension=ou:LEVEL-1;LEVEL-2;m0frOspS7JY&filter=pe:"+$scope.selectedPeriod+"&displayProperty=NAME";
                }else{
                    $scope.url = $scope.baseUrl+"api/analytics.json?dimension=dx:"+cardObject.data+"&dimension=ou:LEVEL-2;LEVEL-3;"+$scope.selectedOrgUnit+"&filter=pe:"+$scope.selectedPeriod+"&displayProperty=NAME";
                }

                $http.get($scope.url).success(function(data){
                    $scope.area = [];
                    cardObject.chartObject.xAxis.categories = [];
                    //
                    var dataToUse = $scope.preparePopData(data);
                    cardObject.chartObject.title.text = cardObject.title;
                    angular.forEach(dataToUse,function(val){
                        cardObject.chartObject.xAxis.categories.push(val.name);
                    });
                    $scope.normalseries = [];
                    if(chart == "pie"){
                        delete cardObject.chartObject.chart;
                        var serie = [];
                        angular.forEach(dataToUse,function(val){
                            serie.push({name: val.name, y: parseInt(val.value)})
                        });
                        $scope.normalseries.push({type: chart, name:cardObject.title , data: serie,showInLegend: true,
                            dataLabels: {
                                enabled: false
                            } });
                        cardObject.chartObject.series = $scope.normalseries;
                    }
                    else if(chart == "combined"){
                        delete cardObject.chartObject.chart;
                        var serie1 = [];
                        var serie = [];

                        angular.forEach(dataToUse,function(val){
                            serie.push(parseInt(val.value));
                            serie1.push({name: val.name , y: parseInt(val.value) })
                        });
                        $scope.normalseries.push({type: 'column', name: cardObject.title, data: serie});
                        $scope.normalseries.push({type: 'spline', name: cardObject.title, data: serie});

                        cardObject.chartObject.series = $scope.normalseries;
                    }
                    else if(chart == 'table'){
                        cardObject.table = {};
                        cardObject.table.colums =[];
                        angular.forEach(dataToUse,function(val){
                            cardObject.table.colums.push({name:val.name,value:parseInt(val.value)});
                        });
                        console.log(cardObject.table.colums);
                    }else if(chart == 'map'){
                        if($scope.selectedOrgUnit == "m0frOspS7JY"){

                            portalService.drawMap($scope.baseUrl,$scope.selectedOrgUnit, 2, cardObject, cardObject.title,dataToUse);

                        }else{
                            console.log($scope.baseUrl);
                            console.log($scope.selectedOrgUnit);
                            console.log(3);
                            console.log(cardObject);
                            console.log(dataToUse);
                            portalService.drawMap($scope.baseUrl,$scope.selectedOrgUnit, 3, cardObject,cardObject.title,dataToUse);

                        }
                    }
                    else{
                        delete cardObject.chartObject.chart;
                        var serie = [];
                        angular.forEach(dataToUse,function(val){
                            serie.push(val.value);
                        });
                        cardObject.chartObject.chart={};
                        cardObject.chartObject.chart.type=chart;
                        $scope.normalseries.push({type: chart, name: cardObject.title, data: serie})
                        cardObject.chartObject.series = $scope.normalseries;
                    }
                    cardObject.chartObject.loading = false
                });
            });

        };
        $rootScope.firstClick2 = function(){
                $scope.prepareSeries();
                $scope.preparePopSeries($scope.cards.popu[0],$scope.cards.popu[0].chart);
        }
        $scope.firstClick2();


    })
    .factory('shared', function() {
        var shared = {
            "facility":0
        };
        return shared;
    });
var ogUnitsObjectConstruct=function(underOne,ObjectNames,ObectData,orgUnits){
    var num='';
    angular.forEach(ObectData,function(value) {
        if(value[1]==orgUnits) {
            if (ObjectNames.metaData.names[value[0]].indexOf(underOne) >= 0) {
                num = value[2];
            }
        }
    });
    return num;
}
var undertwoObject=function(undertwo,ObjectNames,ObectData,orgUnits){
    var num='';
    angular.forEach(ObectData,function(value) {
        if(value[1]==orgUnits) {
            if (ObjectNames.metaData.names[value[0]].indexOf(undertwo) >= 0) {
                num = value[2];
            }
        }
    });
    return num;
}
var underthreeObject=function(underthree,ObjectNames,ObectData,orgUnits){
    var num='';
    angular.forEach(ObectData,function(value) {
        if(value[1]==orgUnits) {
            if (ObjectNames.metaData.names[value[0]].indexOf(underthree) >= 0) {
                num = value[2];
            }
        }
    });
    return num;
}
var underfourObject=function(underfour,ObjectNames,ObectData,orgUnits){
    var num='';
    angular.forEach(ObectData,function(value) {
        if(value[1]==orgUnits) {
            if (ObjectNames.metaData.names[value[0]].indexOf(underfour) >= 0) {
                num = value[2];
            }
        }
    });
    return num;
}
function getPopDataFromUrl(arr,ou){
    var num = 0
    $.each(arr,function(k,v){
        if(v[1] == ou){
            num = Number(v[2])
        }
    });
    return num;
}
