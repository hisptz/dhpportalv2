/**
 * Created by leo on 11/11/15.
 */
/**
 * THE BEGINNING OF MAP CONTROLLER FUNCTION
 * */

(function() {
    'use strict';

    angular
        .module('dhpportal')
        .config(function($httpProvider) {
            $httpProvider.defaults.withCredentials = true;
        })
        .factory('shared',  function(){
            var shared = {
                "facility":0
                         };
            return shared;
        })
        .controller('mapController', mapController);

    mapController.$inject   = ['$scope', '$http','$timeout', 'olData','olHelpers','portalService','profileService','utilityService','shared'];
    function mapController($scope, $http,$timeout, olData,olHelpers,portalService,profileService,utilityService,shared) {

     }
})()


