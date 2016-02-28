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
    );


})()
