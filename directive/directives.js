(function () {
    'use strict';

    angular
        .module('dhpportal')
        .directive('summaryTable', summaryTable);

    summaryTable.$inject = ['renderItLikeHTML'];

    /* @ngInject */
    function summaryTable(renderItLikeHTML) {
       return {
            link: function (scope, element, attrs) {

            },
            restrict: 'E',
           templateUrl:"partials/summarytable.html"
        };

    }
})();