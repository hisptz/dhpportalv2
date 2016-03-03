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
                console.log(scope.profile);
            },
            restrict: 'E',
           scope:{
               profile:'&data'
           },
           templateUrl:"partials/summarytable.html"
        };

    }
})();