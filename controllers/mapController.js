
    angular
        .module('dhpportal')
        .config(function($httpProvider) {
            $httpProvider.defaults.withCredentials = true;
        })
        .controller('mapController', mapController);

    mapController.$inject   = ['$scope','$rootScope','$cookies','$filter','$http','$timeout','$interval','$location','$routeParams','dataService','profileService','utilityService','pendingRequestsService','leafletData'];
    function mapController($scope,$rootScope,$cookies,$filter,$http,$timeout,$interval,$location,$routeParams,dataService,portalService,utilityService,pendingRequestsService,leafletData) {

      $rootScope.updateDataContainers = function(){
          $scope.selectedYear = $scope.selectedYearBuffer;
        var pendingReqiests = pendingRequestsService.get();

          pendingRequestsService.cancelAll();

          if ( $scope.selectedOrgUnit ) {
            console.log($scope.selectedItems);
            angular.extend($scope, {
                   centeredCoordinate: {
                       lat: -5.79,
                       lng: 36.32,
                       zoom: 5
                   },
                   geojson : getGeoJson($scope.selectedItems),
                   defaults: {
                        scrollWheelZoom: false
                    }
               });


               leafletData.getMap().then(function(map) {
                               var latlngs = [];
                               for (var i in $scope.geojson.data.features[0].geometry.coordinates) {
                                   var coord = $scope.geojson.data.features[0].geometry.coordinates[i];
                                   for (var j in coord) {
                                       var points = coord[j];
                                       for (var k in points) {
                                           latlngs.push(L.GeoJSON.coordsToLatLng(points[k]));
                                       }
                                   }
                               }
                               map.fitBounds(latlngs);
                           });

          }
          else
          {

          }

      }

      function getGeoJson(selectedItems) {

      var geoJsonObject = {
                     data:{
                       "type": "FeatureCollection",
                       "features": [
                       ]
                     },style: {
                        fillColor: "green",
                        weight: 2,
                        opacity: 1,
                        color: 'white',
                        dashArray: '3',
                        fillOpacity: 0.7
                      }
                    }
                    
        angular.forEach(selectedItems,function(item){

          var feature = {
                          "type": "Feature",
                          "properties": {},
                          "geometry": {
                            "type": "Polygon",
                            "coordinates": eval(item.coordinates)
                          },
                          "style": {
                            "fillColor": "green",
                            "weight": 2,
                            "opacity": 1,
                            "color": 'black',
                            "fillOpacity": 0.7
                          }
                      };

        geoJsonObject.data.features.push(feature);

        })

        return geoJsonObject;
      }

    }
