(function () {
    'use strict';

    angular
        .module('dhpportal')
        .directive('summaryTable', summaryTable);

    summaryTable.$inject = ['$window'];

    /* @ngInject */
    function summaryTable($window) {
       return {
            link: function (scope, element, attrs) {

            },
            restrict: 'AE',
           templateUrl:"partials/summarytable.html"
        };

    }
})();