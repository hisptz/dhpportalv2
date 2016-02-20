angular.module("dhpportal")
    .service('mapService',['$rootScope','$http','olData','olHelpers','$timeout','portalService','profileService','utilityService','shared',function($scope,$http,olData,olHelpers,$timeout,portalService,profileService,utilityService,shared){

        var map = this;
        map.features = [];
        map.renderMap = function(selectedYear,orgunitStrings){
            var maplayer = {};
            map.geoLayer= {"type":"FeatureCollection","features":[]};
            var geoUrl = portalService.base+"api/geoFeatures.json?ou=ou:"+orgunitStrings;

            return $http({method:'GET',url:geoUrl,dataType:'json',catche:true,isModified:true});

            return maplayer;
        }

        map.prepareMapObject = function(data,analytics_data){


            map.prepareFeatures(data,analytics_data);


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
                            url:"https://maps.wikimedia.org/#6/-6.446/34.980"
//                            url:"https://openstreetmap.org/#map=" + 5.6  + "/" + (-6.45)+ "/" + 35
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
        map.prepareFeatures = function(data,nalaytics_data){

            console.info("anlysis");
            console.info(nalaytics_data);
            angular.forEach(data,function(value){
                console.log(value)
                map.features[value.id] = {
                facility_id:value.id,
                name:value.na,
//                value:value.na,
                opacity:0.8,
                "color":map.decideOnColor(value,nalaytics_data),
                "facility":Math.floor(Math.random() * 256)
            };
            });



        }

        map.decideOnColor = function(value,nalaytics_data){
            var completenes = "Pc2t6Tq5era";
            var color = "red";
            var orgunits = nalaytics_data.metaData.ou;
            var rows = nalaytics_data.metaData.rows;
            var names = nalaytics_data.metaData.names;

            if(rows.length<=0){
                return color;
            }else if(rows.length>0){
                if(map.isCompleted(rows,value,completenes)){
                    return 'green';
                }

            }


        }

        map.isCompleted = function(rows,value,completenes){
            var theIndex = null;
            angular.forEach(rows,function(valuex,index){
                if(valuex[completenes][value]=="100"){
                    theIndex = index;

                    return false;
                }
            })

            if(theIndex!=null){
                return true;
            }

            return false;

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
