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
           templateUrl:"partials/summarytable.html"
        };

    }
})();