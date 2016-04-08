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
        chartService.totalFacilities = 0;

        chartService.prepareSeries = function(features,districts){
            if(typeof districts == "undefined"){
                return {submitted:0,notsubmmitted:0};
            }
          var redfacility = districts.length;
          var greenfacility = 0;
            angular.forEach(districts,function(value){

                if(features[value.id].color=="green"){
                    greenfacility++;
                    redfacility = redfacility-greenfacility;
                }

            });

            return {submitted:greenfacility,notsubmmitted:redfacility};
        }

        chartService.getChartObject = function(features,districts){

            var series = chartService.prepareSeries(features,districts);
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
                        ['Not Submitted',series.notsubmmitted],
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