angular.module("dhpportal")
    .service('mapService',['$rootScope','$http','olData','olHelpers','$timeout','portalService','profileService','utilityService','shared',function($scope,$http,olData,olHelpers,$timeout,portalService,profileService,utilityService,shared){

        var map = this;
        map.renderMap = function(selectedYear,orgunitStrings){
            var maplayer = {};
            map.geoLayer= {"type":"FeatureCollection","features":[]};
            var geoUrl = portalService.base+"api/geoFeatures.json?ou=ou:"+orgunitStrings;

            return $http({method:'GET',url:geoUrl,dataType:'json',catche:true,isModified:true});


//            $scope.netfailure = null;
//            var tempo = data.features;
//            angular.forEach(tempo,function(value,index){
//                tempo[index].expanded = false;
//            });
//            $scope.orgunit = tempo;
//            var TotalGeo = {
//                "type":"FeatureCollection",
//                "features":[]
//            };
//            var districtProperties = [];
//
//            var dateObject = new Date();
//            $scope.thisyear = dateObject.getFullYear();
//            $scope.districts = {};
//            $scope.DistrictFreeObject = [];
//            var getApproPiateColor = function(percent){
//
//
//                if(percent>0){
//                    return "#55CD55"
//                }
//
//                if(percent==0){
//                    return "#E38280"
//                }
//            }
//
//            var orgUnitsString = utilityService.prepareOrgString(data.features);
//
//            var profilePromise = profileService.checkProfileByOrgUnitAndPeriod(orgUnitsString,$scope.$parent.main.selectedYear);
//            profilePromise.then(function(datas){
//                var withDataSet = [];
//                if(datas.completeDataSetRegistrations!=="undefined"){
//                    angular.forEach(datas.completeDataSetRegistrations,function(dataSetOrg,itsIndex){
//
//                        withDataSet.push(dataSetOrg.organisationUnit.id);
//                    });
//                }
//
//                if(!localStorage.getItem('widataset')){
//                    localStorage.setItem('widataset',JSON.stringify(withDataSet));
//                }else{
//                    localStorage.removeItem('widataset');
//                    localStorage.setItem('widataset',JSON.stringify(withDataSet));
//                }
//
//                var objectSeries = [];
//                angular.forEach(data.features, function (value, index) {
//                    var number_of_files_available = profileService.profileStatistics(value,withDataSet);
//                    if(number_of_files_available.count>0){
//                        objectSeries.push(number_of_files_available);
//                    }
//
//
//                    var percent = 0;
//                    if(number_of_files_available.total==0){
//                        percent = 0;
//                    }else{
//                        percent = number_of_files_available.count/number_of_files_available.total;
//                    }
//                    var hue = getApproPiateColor(percent.toFixed(3));
//
//                    // creating dynamic colors for district
//                    $scope.saveColorInlocalStorage(value.id,hue);
//
//                    // prepare objects of district for properties to display on tooltip
//                    districtProperties[value.id] = {
//                        district_id:value.id,
//                        year:$scope.thisyear,
//                        name:value.properties.name,
//                        "color":hue,
//                        "facility":Math.floor(Math.random() * 256)
//                    };
//
//                    $scope.DistrictFreeObject.push(districtProperties[value.id]);
//                    $scope.districts[value.id]= districtProperties;
//
//                    // creating geojson object
//                    var Object =
//                    {
//                        "type":"Feature",
//                        "id":value.id,
//                        "properties":{
//                            "name":value.properties
//                        },
//                        "geometry":{
//                            "type":value.geometry.type,
//                            "coordinates":value.geometry.coordinates
//                        },
//                        "style":{
//                            fill:{
//                                color:$scope.getColorFromLocalStorage(value.id),
//                                opacity:5
//                            },
//                            stroke:{
//                                color:'white',
//                                width:2
//                            }
//                        }
//                    };
//                    TotalGeo.features.push(Object);
//                });
//                localStorage.setItem("seriesObject",JSON.stringify(objectSeries));
//                $scope.$emit ('drawChartNow');
//
//                // function getter for district object
//                var getColor = function(district){
//                    if(!district || !district['district_id']){
//                        return "#FFF";
//                    }
//                    var color = districtProperties[district['district_id']].color;
//                    return color;
//                }
//                var getStyle = function(feature){
//                    var style = olHelpers.createStyle({
//                        fill:{
//                            color:getColor($scope.districts[feature.getId()]),
//                            opacity:0.4
//                        },
//                        stroke:{
//                            color:'white',
//                            width:2
//                        },
//                        text:  new ol.style.Text({
//                            textAlign: 'center',
//                            textBaseline: 'middle',
//                            font: 'Arial',
//                            text: formatText(districtProperties[feature.getId()].name),
//                            fill: new ol.style.Fill({color: "#000000"}),
//                            //stroke: new ol.style.Stroke({color: "#000000", width: 0}),
//                            offsetX: 0,
//                            offsetY: 0,
//                            rotation: 0
//                        })
//                    });
//                    return [ style ];
//
//                }
//
//                function formatText(orgunitname){
//                    var textArray = orgunitname.split(" ");
//                    return "";
//                }
//
//                angular.extend($scope, {
//                    Africa: {
//                        lat: -6.45,
//                        lon: 35,
//                        zoom: 5.6
//                    },
//                    layers:[
//                        //{
//                        //    name:'mapbox',
//                        //    source: {
//                        //        type: 'TileJSON',
//                        //        url:'https://api.tiles.mapbox.com/v3/mapbox.geography-class.jsonp'
//                        //    }
//                        //}
//                        //,
//                        {
//                            name:'geojson',
//                            source: {
//                                type: 'GeoJSON',
//                                geojson: {
//                                    object: TotalGeo
//                                }
//                            },
//                            style: getStyle
//                        }
//                    ],defaults: {
//                        events: {
//                            layers: [ 'mousemove', 'click']
//                        }
//                    }
//                });
//
//                $scope.districts = {};
//                angular.forEach($scope.DistrictFreeObject,function(data,index){
//                    var district = data;
//                    $scope.districts[district['district_id']] = district;
//                });
//
//
//                olData.getMap().then(function(map) {
//                    var previousFeature;
//                    var overlay = new ol.Overlay({
//                        element: document.getElementById('districtbox'),
//                        positioning: 'top-right',
//                        offset: [100, -100],
//                        position: [100, -100]
//                    });
//                    var overlayHidden = true;
//                    // Mouse click function, called from the Leaflet Map Events
//                    $scope.$on('openlayers.layers.geojson.mousemove', function(event, feature, olEvent) {
//                        $scope.$apply(function(scope) {
//
//                            scope.selectedDistrictHover = feature ? $scope.districts[feature.getId()] : '';
//                            if(feature) {
//                                scope.selectedDistrictHover = feature ? $scope.districts[feature.getId()] : '';
//                            }
//
//                        });
//
//                        if (!feature) {
//                            map.removeOverlay(overlay);
//                            overlayHidden = true;
//                            return;
//                        } else if (overlayHidden) {
//                            map.addOverlay(overlay);
//                            overlayHidden = false;
//                        }
//                        overlay.setPosition(map.getEventCoordinate(olEvent));
//                        if (feature) {
//                            feature.setStyle(olHelpers.createStyle({
//                                fill: {
//                                    color: getColor($scope.districts[feature.getId()])
//                                },
//                                stroke: {
//                                    color: '#A3CEC5',
//                                    width:2
//
//                                }
//                            }));
//                            if (previousFeature && feature !== previousFeature) {
//                                previousFeature.setStyle(getStyle(previousFeature));
//                            }
//                            previousFeature = feature;
//                        }
//                    });
//
//                    $scope.$on('openlayers.layers.geojson.click', function(event, feature, olEvent) {
//                        $scope.$parent.main.chart_shown = false;
//                        $scope.$parent.main.backToGrid()
//                        //$scope.closeTootipHover();
//                        $scope.$apply(function(scope) {
//                            scope.selectedDistrict = feature ? $scope.districts[feature.getId()] : '';
//                            $scope.$parent.main.org_unit_selected = scope.selectedDistrict.district_id;
//                            if(feature) {
//                                // looping throught indicator types
//                                scope.selectedDistrict = feature ? $scope.districts[feature.getId()] : '';
//                                $scope.selectedDistrictName = scope.selectedDistrict.name;
//                                var orgUnit = {children:null};
//                                $scope.$parent.main.processView(orgUnit,scope.selectedDistrict.name,scope.selectedDistrict.district_id)
//
//
//                            }
//                        });
//
//                        if (!feature) {
//                            map.removeOverlay(overlay);
//                            overlayHidden = true;
//                            return;
//                        } else if (overlayHidden) {
//                            map.addOverlay(overlay);
//                            overlayHidden = false;
//                        }
//                        overlay.setPosition(map.getEventCoordinate(olEvent));
//                        if (feature) {
//                            feature.setStyle(olHelpers.createStyle({
//                                fill: {
//                                    color: '#FFF'
//                                }
//                            }));
//                            if (previousFeature && feature !== previousFeature) {
//                                previousFeature.setStyle(getStyle(previousFeature));
//                            }
//                            previousFeature = feature;
//                        }
//                    });
//                    $scope.$on('openlayers.layers.geojson.featuresadded', function(event, feature, olEvent) {
//                        $scope.$apply(function(scope) {
//                            if(feature) {
//                                $scope.id = feature.getId();
//                                scope.selectedDistrict = feature ? $scope.districts[feature.getId()]: '';
//                            }
//                        });
//
//                    });
//                });
//                $scope.closeTootip = function(){
//                    $scope.selectedDistrict = null;
//
//                }
//                $scope.closeTootipHover = function(){
//                    $scope.selectedDistrictHover = null;
//
//                }
//
//
//            });



            return maplayer;
        }

        map.prepareMapObject = function(data){
            /// prepare a mpa compartible geojson

            angular.forEach(data,function(value){
                var feature = {
                    type:"GeoJSON",
                    id:"",
                    geometry:{
                        type:"",
                        coordinates:null
                    },
                    properties:{
                        code:"",
                        name:"",
                        level:"",
                        parent:"",
                        parentGraph:""
                    },style:""
                }

                feature.type = "Feature";
                feature.geometry.type = "MultiPolygon";

                feature.geometry.coordinates    = JSON.parse(value.co);
                feature.properties.code         = null;
                feature.properties.name         = value.na;
                feature.properties.level        = value.le;
                feature.properties.parent       = value.pi;
                feature.properties.parentGraph  = value.pg;
                feature.id  = value.id;
                feature.style  = map.getStyle(feature);
                map.geoLayer.features.push(feature);





            });

            var boundaries =  {
                Africa: {
                    lat: -6.45,
                    lon: 35,
                    zoom: 5.6
                },
                layers:[
                    {
                        name:'OpenStreetMap',
                        source: {
                            type: 'OSM',
                            url:"http://openstreetmap.org/#map=" + 5.6  + "/" + (-6.45)+ "/" + 35
                        }
                    }
                    ,
                    {
                        name:'geojson',
                        visible: true,
                        opacity:0.8,
                        source: {
                            type: 'GeoJSON',
                            geojson: {
                                object: map.geoLayer
                            }
                        },
                        style: map.getStyle
                    }
                ],
                defaults: {
                    events: {
                        layers: [ 'mousemove', 'click']
                    }
                }
            }

            return boundaries;

        }

        map.getStyle = function(feature){
            console.log(feature);
            var color = "";
            var featureId = "";

            if(feature.id){
                featureId =feature.id;

            }else{
                featureId = feature.getId();
            }

            color = "red";

            var style = olHelpers.createStyle({
                fill:{
                    color:color,
                    opacity:0.8
                },
                stroke:{
                    color:'#cccccc',
                    width:1
                },
                text:  new ol.style.Text({
                    textAlign: 'center',
                    textBaseline: 'middle',
                    font: 'Arial',
                    //text: formatText(districtProperties[feature.getId()].name),
                    fill: new ol.style.Fill({color: "#000000"}),
                    stroke: new ol.style.Stroke({color: "#cccccc", width: 1}),
                    offsetX: 0,
                    offsetY: 0,
                    rotation: 0
                })
            });
            return [ style ];

        }
        return map;
    }])
    .factory('shared', function() {
        var shared = {
            "facility":0
        };
        return shared;
    });
