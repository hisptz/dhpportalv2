(function () {
    'use strict';

    angular
        .module('dhpportal')
        .config(function($httpProvider) {
            $httpProvider.defaults.withCredentials = true;
        })
        .service('tableService', tableService);
    tableService.$inject = ['$http'];
    function tableService($http) {
        var tableService = {};

        tableService.getTableObject = function(features,data,selectedYear){
            var tableobject = [];

            angular.forEach(data,function(value){
                if(features[value.id].color=="green"){
                    tableobject.push({name:features[value.id].name,url:'/uploads/'+features[value.id].name+'_'+selectedYear+'.pdf'});
                }
            })

            return tableobject;
        }
        return tableService;
    }

})();