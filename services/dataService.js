(function () {
    'use strict';

    angular
        .module('dhpportal')
        .service('dataService', dataService);
    dataService.$inject = ['$http','profileService'];
    function dataService($http,profileService) {
        var dataService = this;
        dataService.baseDHIS = profileService.baseDHIS;
        dataService.getPopulationData = function(orgunit,period){
            //return $http.get("server/analytics.json").then(handleSuccess, handleError('Error loading population data'));
            return $http.get(dataService.baseDHIS+"api/analytics.json?dimension=Cow9nZikDgD:FfN1mqXvpR7;HKU7NijIEIH;LBipXEMD6mq;aZcKJ9XxvaF;h8JRv8POdfy;p1b4SYcdjJw&dimension=dx:ykShMtNgDB1&dimension=hENn80Fmmlf:mtUMlCLFTTz;syxWmui9UMq&filter=ou:"+orgunit+"&filter=pe:"+period).then(handleSuccess, handleError('Error loading population data'));
        }


        dataService.createPopulationObject = function(data){
            var output = {male:{},female:{}};
            var categoryOption = data.metaData.co;
            var agePopulation  = data.metaData.Cow9nZikDgD;
            var jinsi  = data.metaData.hENn80Fmmlf;
            var dataElement    = data.metaData.dx;
            var names          = data.metaData.names;
            var rows           = data.rows;

            angular.forEach(jinsi,function(value,index){
                if(names[value]=='KE'){
                    angular.forEach(agePopulation,function(valuex,indexs){

                        angular.forEach(rows,function(rowValue,rowIndex){
                            if(rowValue[0]==dataElement&&rowValue[1]==valuex&&rowValue[2]==value){
                                output.female[names[valuex]] = dataService.toNormalize(rowValue[3]);
                            }
                        })

                    });

                }

                if(names[value]=='ME'){

                    angular.forEach(agePopulation,function(valuex,indexs){

                            angular.forEach(rows,function(rowValue,rowIndex){
                                if(rowValue[0]==dataElement&&rowValue[1]==valuex&&rowValue[2]==value){
                                    output.male[names[valuex]] = dataService.toNormalize(rowValue[3]);
                                }
                            })

                    });

                }
            });
            return output;
        }

        dataService.toNormalize = function(data){
            var theIndex = data.indexOf('E');

            if(theIndex>=0){
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