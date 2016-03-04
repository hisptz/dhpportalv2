(function() {
    'use strict';

    angular
        .module('dhpportal')
        .filter('renderItLikeHTML',
        function ($sce){

            return function(stringToParse)
            {
                return $sce.trustAsHtml(stringToParse);
            }

        }
    )
    .filter('addElements', function (){

            var sum = 0;
            return function(input,param1)
            {
                var args = Array.prototype.slice.call(arguments);
                angular.forEach(args,function(value,index){

                    if(isNaN(value)){

                    }else{
                        sum = sum+Number(value);
                        if(index==0){
                           sum = sum-Number(value);
                        }
                    }
                });

                if(sum==0){
                    return "";
                }
                return sum;
            }

        }
    );


})()
