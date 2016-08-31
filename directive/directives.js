(function () {
    'use strict';

    angular
        .module('dhpportal')
        .directive('summaryTable', summaryTable)
        .directive('printHtml', printHtml)
        .controller('summaryController',function($scope){


        });

    summaryTable.$inject = ['$filter'];

    /* @ngInject */
    function summaryTable($filter) {
       return {
            link: function (scope, element, attrs) {

            },
            restrict: 'E',
           scope:{
               profile:'=data'
           },
           templateUrl:"partials/summarytable.html"
        };

    }

    function printHtml(){
        var printSection = document.getElementById('summary_table');

        // if there is no printing section, create one
        if (!printSection) {
            printSection = document.createElement('div');
            printSection.id = 'summary_table';
            document.body.appendChild(printSection);
        }

        function printElement(elem) {
            // clones the element you want to print
            var domClone = elem.cloneNode(true);
            printSection.appendChild(domClone);
        }

        return {
            link: function (scope, element, attrs) {
                element.on('click', function () {
                    var elemToPrint = document.getElementById(attrs.printElementId);
                    if (elemToPrint) {
                        printElement(elemToPrint);
                        window.print();
                    }
                });

                window.onafterprint = function () {
                    // clean the print section before adding new content
                    printSection.innerHTML = '';
                }
            },
            restrict: 'A'
        };
    }
})();