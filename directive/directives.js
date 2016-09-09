(function () {
    'use strict';

    angular
        .module('dhpportal')
        .directive('summaryTable', summaryTable)
        .directive('printHtml', printHtml)
        .directive('alertPanel',alertPanel)
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
    var size = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    }

    function alertPanel(){
      return {
        scope:{
          tableData:'=tableData',
          tableName:'=tableName',
          errorCheck:'=errorCheck',
          errorMessage:'=errorMessage'
        },
        templateUrl:"partials/alert.html"
          ,
          link: function (scope, element, attrs) {
            scope.showAlertBox = false;

            scope.message = 'No '+scope.tableName+' data available';

            if ( scope.errorCheck )
            {
              scope.message = errorMessage;
              scope.showAlertBox = true;
            }

            scope.$watch('tableData',function(value){

                if ( value ) {
                  var counter = 0;
                  var index = 0;
                  var count = size(scope.tableData);
                  angular.forEach(scope.tableData, function(value,index){

                    index++;
                    if ( size(value) == 0 ) {
                      counter++;
                    }
                    console.log(count,index,counter)
                    if (count == index && counter == count ){
                        scope.showAlertBox = true;console.log("THIS HAS EMPTY DATA");
                    }

                  })

                }


            })


            scope.hideAlertBox  = function(){
              scope.showAlertBox = false;
            }

          },
          restrict: 'AE'
      }
    }
    function printHtml(){
        var printSection = document.getElementById('previewProfile');

        // if there is no printing section, create one
        if (!printSection) {
            printSection = document.createElement('div');
            printSection.id = 'previewProfile';
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
