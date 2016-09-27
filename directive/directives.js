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
                scope.showAlertBox = false;
                if ( value ) {
                  var counter = 0;
                  var index = 0;
                  var count = size(scope.tableData);
                  angular.forEach(scope.tableData, function(value,indexx){

                    index++;
                    if ( size(value) == 0 ) {
                      counter++;
                    }
                    // console.log(count,index,counter,size(value));
                    if (count == index && counter == count ){
                        scope.showAlertBox = true;
                    }else{
                        scope.showAlertBox = false;
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

        return {
            link: function (scope, element, attrs) {

              var printSection = document.getElementById(attrs.printElementId);

              // if there is no printing section, create one
              if (!printSection) {
                  printSection = document.createElement('div');
                  printSection.id = attrs.printElementId;
                  document.body.appendChild(printSection);

              }

              element.on('click', function () {

                    var elemToPrint = document.getElementById(attrs.printElementId);
                    if (elemToPrint) {
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
