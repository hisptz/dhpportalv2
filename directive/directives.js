(function () {
    'use strict';

    angular
        .module('dhpportal')
        .directive('summaryTable', summaryTable);

//    summaryTable.$inject = ['$scope'];

    /* @ngInject */
    function summaryTable() {
       return {
            link: function (scope, element, attrs) {

            },
            restrict: 'E',
           templateUrl:"partials/summarytable.html"
        };

    }
})();