
    angular
        .module('dhpportal')
        .config(function($httpProvider) {
            $httpProvider.defaults.withCredentials = true;
        })
        .controller('mapController', mapController);

    mapController.$inject   = ['$scope','$rootScope','$cookies','$filter','$http','$timeout','$interval','$location','$routeParams','dataService','profileService','utilityService','pendingRequestsService','mapService','leafletData'];
    function mapController($scope,$rootScope,$cookies,$filter,$http,$timeout,$interval,$location,$routeParams,dataService,portalService,utilityService,pendingRequestsService,mapService,leafletData) {
      $scope.mapIsLoading = true;
      $rootScope.updateMap = function(selectedItems,selectedYear){
        $scope.mapIsLoading = true;
          var pendingReqiests = pendingRequestsService.get();

          pendingRequestsService.cancelAll();

          if ( selectedItems ) {
            var filesFromLocalStorage = localStorage.getItem("files_");
            if ( filesFromLocalStorage ) {
                  $scope.mapIsLoading = false;
                  renderMap();
            }else{
              dataService.loadAllFiles().then(function(files){
                  dataService.formatDataForMap(files,selectedYear);
                  $scope.mapIsLoading = false;
                  renderMap();
              });
            }




          }
          else
          {

          }
      }


      function getGeoJson(selectedItems) {

        var geoJsonObject = {
                     data:{
                       type: "FeatureCollection",
                       features: [
                       ]
                     },style:{
                       fillColor: "white",
                       weight: 2,
                       opacity: 1,
                       color: '#cccccc',
                       fillOpacity: 0.7
                     },
                     layers: {
                          baselayers: {
                              googleHybrid: {
                                  name: 'Google Hybrid',
                                  layerType: 'HYBRID',
                                  type: 'google'
                              }
                          }
                      }
                    }


          geoJsonObject = mapService.getOtherPolygons(geoJsonObject,selectedItems);

        return geoJsonObject;
      }

      function renderMap(){

                    angular.extend($scope, {
                           centeredCoordinate: {
                               lat: -5.79,
                               lng: 36.32,
                               zoom: 6
                           },
                           geojson : getGeoJson(selectedItems),
                            legend: {
                                 position: 'bottomleft',
                                 colors: [ 'green','red' ],
                                 labels: [ 'Submitted','Not&nbsp;Submitted' ]
                             },
                              events: {
                                  map: {
                                      enable: ['click'],
                                      logic: 'emit'
                                  }
                              },
                              defaults: {
                                   scrollWheelZoom: false
                            }
                       });


                       $scope.$on('leafletDirectiveGeoJson.click', function(event){
                          console.log(event);
                      });


                       leafletData.getMap().then(function(map) {



                                        L.geoJson($scope.geojson.data.features, {
                                           style: function(feature) {

                                             if ( typeof feature.properties.hasProfile != 'undefined' ){

                                                if ( feature.properties.hasProfile == true ){
                                                  return {
                                                      fillColor: "green",
                                                      weight: 2,
                                                      opacity: 1,
                                                      color: '#cccccc',
                                                      fillOpacity: 0.7
                                                  }
                                                }else{
                                                  return {
                                                    fillColor: "#FE4C4C",
                                                    weight: 2,
                                                    opacity: 1,
                                                    color: '#cccccc',
                                                    fillOpacity: 0.7
                                                  }
                                                }

                                             }else{
                                               return {
                                                   fillColor: "white",
                                                   weight: 2,
                                                   opacity: 1,
                                                   color: '#cccccc',
                                                   fillOpacity: 0.7
                                               }
                                             }

                                           }
                                       }).addTo(map);

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

    }
