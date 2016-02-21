(function () {
    'use strict';

    angular
        .module('dhpportal')
        .directive('summaryTable', summaryTable);

    summaryTable.$inject = ['$scope','renderItLikeHTML'];

    /* @ngInject */
    function summaryTable($scope,renderItLikeHTML) {
       return {
            link: function (scope, element, attrs) {

            },
            restrict: 'E',
           templateUrl:"partials/summarytable.html"
        };

    }
})();