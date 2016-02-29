(function () {
    'use strict';

    angular
        .module('dhpportal')
        .directive('summaryTable', summaryTable);

    summaryTable.$inject = ['$filter'];

    /* @ngInject */
    function summaryTable($filter) {
       return {
            link: function (scope, element, attrs) {

            },
            restrict: 'E',
           scope:{
               summaryData:'=data'
           },
           templateUrl:"partials/summarytable.html"
        };

    }
})();