(function () {
    'use strict';

    angular
        .module('dhpportal')
        .config(function($httpProvider) {
            $httpProvider.defaults.withCredentials = true;
        })
        .service('chartService', chartService);
    chartService.$inject = ['$http'];
    function chartService($http) {
        var chartService = {};
        chartService.totalFacilities = 166;

        chartService.prepareSeries = function(){
            var submitted = 0;
            var objectSeries = JSON.parse(localStorage.getItem("seriesObject"));
            angular.forEach(objectSeries,function(valueObject,indexObject){
                submitted+=valueObject.count;
            });

            var notSubmitted = chartService.totalFacilities - submitted;

            return {submitted:submitted,notSubmitted:notSubmitted};
        }

        chartService.getChartObject = function(){
            var series = chartService.prepareSeries();
            return  {
                options: {
                    chart: {
                        type: 'pie',
                        zoomType: 'x'
                    }
                    ,colors:
                        ['#E38280', '#50B432']


                },
                series: [{
                    type: 'pie',
                    name: 'Distribution',
                    data: [
                        ['Not Submitted',series.notSubmitted],
                        ['Submitted',  series.submitted]

                    ]
                }],
                title: {
                    text: ''
                },
                xAxis: {currentMin: 0, currentMax: 10, minRange: 1},
                loading: false
            }
        }

        return chartService;
    }

})();