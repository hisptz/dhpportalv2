
    angular
        .module('dhpportal')
        .config(function($httpProvider) {
            $httpProvider.defaults.withCredentials = true;
        })
        .controller('mapController', mapController);

    mapController.$inject   = ['$scope','$rootScope','$cookies','$filter','$http','$timeout','$interval','$location','$routeParams','dataService','profileService','utilityService','pendingRequestsService','mapService','leafletData'];
    function mapController($scope,$rootScope,$cookies,$filter,$http,$timeout,$interval,$location,$routeParams,dataService,portalService,utilityService,pendingRequestsService,mapService,leafletData) {
      $scope.mapIsLoading = true;
      $scope.isDistrict = false;
      $scope.files = null;
      $rootScope.updateMap = function(selectedItems,selectedYear){
        $scope.mapIsLoading = true;
          var pendingReqiests = pendingRequestsService.get();

          pendingRequestsService.cancelAll();

          if ( selectedItems ) {

              dataService.loadAllFiles().then(function(files){
                  var files = dataService.formatDataForMap(files,selectedYear);
                  $scope.mapIsLoading = false;
                  renderMap(selectedItems,selectedYear,files);
              });

          }
          else
          {

          }
      }


      $rootScope.getPDFProfileView = function(district_name,selectedYear){
          return dataService.getPdfProfile($scope.files,district_name,selectedYear);
      }

      function getGeoJson(selectedItems,files) {

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


          geoJsonObject = mapService.getOtherPolygons(geoJsonObject,selectedItems,files);

        return geoJsonObject;
      }

      function renderMap(selectedItems,selectedYear,files){
                    $scope.submitted = 0;
                    $scope.total = selectedItems[0].children.length;
                    angular.extend($scope, {
                           centeredCoordinate: {
                               lat: -5.79,
                               lng: 36.32,
                               zoom: 6
                           },
                           geojson : getGeoJson(selectedItems,files),
                            legend: {
                                 position: 'bottomleft',
                                 colors: [ 'green','red' ],
                                 labels: [ 'Submitted&nbsp;('+$scope.submitted+')','Not&nbsp;Submitted&nbsp;('+($scope.total-$scope.submitted)+')' ]
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


                       leafletData.getMap().then(function(map) {
                                     function onEachFeature (feature, layer){
                                          layer.on({
                                              mouseout:function(e){
                                                  $scope.currentFeatureTitle = false;
                                              },
                                              mouseover:function(e){
                                                  if ( feature.properties.name.indexOf('Council') >= 0 ) { $scope.isDistrict = true; $scope.district_name = feature.properties.name; } else { $scope.isDistrict = false; }
                                                  $scope.currentFeatureTitle = feature.properties.name+" "+mapService.getStatistics(selectedItems,feature.properties.name,selectedYear,files);
                                                  $scope.files = files;
                                              },
                                              click: function(e){
                                                if ( feature.properties.name.indexOf('Council') >= 0 ) { $scope.isDistrict = true; $scope.district_name = feature.properties.name; } else { $scope.isDistrict = false; }
                                                $scope.currentFeatureTitle = feature.properties.name+" "+mapService.getStatistics(selectedItems,feature.properties.name,selectedYear,files);
                                                $scope.submitted = mapService.checkStatistics(selectedItems,feature.properties.name,selectedYear,files);
                                                $scope.files = files;
                                                 map.fitBounds(e.target.getBounds());
                                              },

                                          });

                                     }

                                    L.geoJson($scope.geojson.data.features, {
                                           style: function(feature) {

                                             if ( typeof feature.properties.hasProfile != 'undefined' ){

                                                if ( feature.properties.hasProfile == true ){
                                                  $scope.submitted+=1;
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

                                             }

                                           },onEachFeature: onEachFeature
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
