(function () {
    'use strict';

    angular
        .module('dhpportal')
        .service('dataService', dataService);
    dataService.$inject = ['$http','$q','profileService','utilityService'];
    function dataService($http,$q,profileService,utilityService) {
        var dataService = this;
        dataService.baseDHIS = profileService.baseDHIS;
        dataService.getPopulationData = function(orgunit,period){

            //return $http.get("server/analytics.json").then(handleSuccess, handleError('Error loading population data'));
            return $http.get(dataService.baseDHIS+"api/analytics.json?dimension=Cow9nZikDgD:FfN1mqXvpR7;HKU7NijIEIH;LBipXEMD6mq;aZcKJ9XxvaF;h8JRv8POdfy;p1b4SYcdjJw&dimension=dx:ykShMtNgDB1&dimension=hENn80Fmmlf:mtUMlCLFTTz;syxWmui9UMq&filter=ou:"+orgunit+"&filter=pe:"+period).then(handleSuccess, handleError('Error loading population data'));
        }

        dataService.getIndicatorDataDistribution = function(indicator,orgunit,period){
            var periodArray = utilityService.getConsecutivePeriods(period);
            var periods = periodArray[0]+";"+periodArray[1]+";"+periodArray[2];
            var therIndicatorUrl = dataService.baseDHIS+"api/analytics.json?dimension=dx:"+indicator+"&dimension=pe:"+periods+"&filter=ou:"+orgunit+"&displayProperty=NAME";
            return $http.get(therIndicatorUrl).then(handleSuccess,handleError('Error loading HMIS Indicators'));
        }
        dataService.getIndicatorDataDelivery = function(indicator,orgunit,period){
            var periodArray = utilityService.getConsecutivePeriods(period);
            var periods = periodArray[0]+";"+periodArray[1]+";"+periodArray[2];
            var therIndicatorUrl = dataService.baseDHIS+"api/analytics.json?dimension=dx:"+indicator+"&dimension=pe:"+periods+"&filter=ou:"+orgunit+"&displayProperty=NAME";
            return $http.get(therIndicatorUrl).then(handleSuccess,handleError('Error loading HMIS Indicators'));
        }
        dataService.getIndicatorDataSystem = function(indicator,orgunit,period){
            var periodArray = utilityService.getConsecutivePeriods(period);
            var periods = periodArray[0]+";"+periodArray[1]+";"+periodArray[2];
            var therIndicatorUrl = dataService.baseDHIS+"api/analytics.json?dimension=dx:"+indicator+"&dimension=pe:"+periods+"&filter=ou:"+orgunit+"&displayProperty=NAME";
            return $http.get(therIndicatorUrl).then(handleSuccess,handleError('Error loading HMIS Indicators'));
        }

        dataService.getIndicatorTopTenMortality = function(indicator,orgunit,period){
            var periodArray = utilityService.getConsecutivePeriods(period);
            var therIndicatorUrlYear1 = dataService.baseDHIS+'/api/analytics/events/aggregate/Mvc0jfU9Ua2.json?stage=mlDzRw3ibhE&dimension=pe:'+periodArray[0]+'&dimension='+indicator+'&filter=ou:'+orgunit+'&outputType=EVENT&displayProperty=NAME';
            var therIndicatorUrlYear2 = dataService.baseDHIS+'/api/analytics/events/aggregate/Mvc0jfU9Ua2.json?stage=mlDzRw3ibhE&dimension=pe:'+periodArray[1]+'&dimension='+indicator+'&filter=ou:'+orgunit+'&outputType=EVENT&displayProperty=NAME';
            var therIndicatorUrlYear3 = dataService.baseDHIS+'/api/analytics/events/aggregate/Mvc0jfU9Ua2.json?stage=mlDzRw3ibhE&dimension=pe:'+periodArray[2]+'&dimension='+indicator+'&filter=ou:'+orgunit+'&outputType=EVENT&displayProperty=NAME';


            var requestOne    = $http.get(therIndicatorUrlYear1).then(handleSuccess,handleError('Error loading HMIS Indicators for '+periodArray[0]));
            var requestTwo    = $http.get(therIndicatorUrlYear2).then(handleSuccess,handleError('Error loading HMIS Indicators for '+periodArray[1]));
            var requestThree  = $http.get(therIndicatorUrlYear3).then(handleSuccess,handleError('Error loading HMIS Indicators for '+periodArray[2]));

            return $q.all([requestOne,requestTwo,requestThree]);

        }
        dataService.getIndicatorTopTenAdmissions = function(indicator,orgunit,period){

            var periodArray = utilityService.getConsecutivePeriods(period);

            var therIndicatorUrlYear1 = dataService.baseDHIS+"api/analytics.json?dimension=dx:"+indicator+"&dimension=pe:"+periodArray[0]+"&filter=ou:"+orgunit+"&displayProperty=NAME";
            var therIndicatorUrlYear2 = dataService.baseDHIS+"api/analytics.json?dimension=dx:"+indicator+"&dimension=pe:"+periodArray[1]+"&filter=ou:"+orgunit+"&displayProperty=NAME";
            var therIndicatorUrlYear3 = dataService.baseDHIS+"api/analytics.json?dimension=dx:"+indicator+"&dimension=pe:"+periodArray[2]+"&filter=ou:"+orgunit+"&displayProperty=NAME";


            var requestOne    = $http.get(therIndicatorUrlYear1).then(handleSuccess,handleError('Error loading HMIS Indicators for '+periodArray[0]));
            var requestTwo    = $http.get(therIndicatorUrlYear2).then(handleSuccess,handleError('Error loading HMIS Indicators for '+periodArray[1]));
            var requestThree  = $http.get(therIndicatorUrlYear3).then(handleSuccess,handleError('Error loading HMIS Indicators for '+periodArray[2]));

            return $q.all([requestOne,requestTwo,requestThree]);

        }


        dataService.createPopulationObject = function(data){
            var output = {male:{},female:{}};

            if  ( data.metaData )
            {
                var categoryOption = data.metaData.co;
                var agePopulation  = data.metaData.Cow9nZikDgD;
                var jinsi          = data.metaData.hENn80Fmmlf;
                var dataElement    = data.metaData.dx;
                var names          = data.metaData.names;
                var rows           = data.rows;

                angular.forEach(jinsi,function(value,index){


                    angular.forEach(agePopulation,function(valuex,indexs){

                        angular.forEach(rows,function(rowValue,rowIndex){
                            if(rowValue[0]==dataElement&&rowValue[1]==valuex&&rowValue[2]==value){
                                if(names[value]=='KE'){output.female[names[valuex]] = dataService.toNormalize(rowValue[3]);}
                                if(names[value]=='ME'){output.male[names[valuex]] = dataService.toNormalize(rowValue[3]);}
                            }
                        })

                    });

                });

            }

            return output;
        }
        dataService.createHealthStatusObject = function(data,year){
            var periods = utilityService.getConsecutivePeriods(year);
            var output = [];

            angular.forEach(periods,function(periodValue,periodIndex){
                output[periodValue] = {};
            });

        if ( data.metaData )
        {

            var dataElement    = data.metaData.dx;
            var names          = data.metaData.names;
            var rows           = data.rows;

            angular.forEach(dataElement,function(elementValue,elementIndex){
                console.log(names[elementValue]);
                console.log(elementValue);
                angular.forEach(output,function(valueOutput,indexOutput){
                    angular.forEach(rows,function(valueRow,indexRow){

                        if(indexOutput==rows[indexRow][1]){
                            if(elementValue==rows[indexRow][0]){
                                output[indexOutput][names[elementValue]] = rows[indexRow][2];
                            }
                        }
                    });
                });

            });


        }
            return output;
        }

        dataService.toNormalize = function(data){

            var theIndex = data.indexOf('E');

            if ( theIndex >= 0 )
            {
               var base =  data.substring(theIndex+1,data.length);
               data =  data.substring(0,theIndex);

                data = (data*Math.pow(10, base)).toFixed(0)
            }else{
                data = (Number(data)).toFixed(0);
            }
                return data;
        }

        return dataService;
    }



    // private functions

    function handleSuccess(res) {
        return res.data;
    }

    function handleError(error) {
        return function () {
            return { success: false, message: error };
        };
    }

})();
