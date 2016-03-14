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

                    if(doesFileExist('uploads/'+features[value.id].name+'_'+selectedYear+'.pdf')){
                        tableobject.push({name:features[value.id].name,url:'uploads/'+features[value.id].name+'_'+selectedYear+'.pdf'});
                    }else{

                    }

                }
            })

            return tableobject;
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
        return tableService;
    }


})();