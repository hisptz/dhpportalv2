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
            return $http.get("https://hmisportal.moh.go.tz/dhis/"+"api/analytics.json?dimension=Cow9nZikDgD:FfN1mqXvpR7;HKU7NijIEIH;LBipXEMD6mq;aZcKJ9XxvaF;h8JRv8POdfy;p1b4SYcdjJw&dimension=dx:ykShMtNgDB1&dimension=hENn80Fmmlf:mtUMlCLFTTz;syxWmui9UMq&filter=ou:"+orgunit+"&filter=pe:"+period).then(handleSuccess, handleError('Error loading population data'));
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