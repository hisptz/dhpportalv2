/**
 * Created by kelvin on 11/16/15.
 */
angular.module("dhpportal")
   .service('portalService',function($http,$resource,utilityService,dataService,$q) {

        var portalService = this;

       portalService.authenticateDHIS = function () {
            return utilityService.login("Demo","DEMO2016");
        };

       portalService.refineSelectedDataCriteria = function (period,OrgUnit,organisationUnitTree) {
           var dataCriteria = {};
           var selectedPeriod = null;
           var selectedOrgUnit = null;
           if ( !period || period == "" )
           {
               var date = new Date();
               selectedPeriod = date.getFullYear();
           }

           if ( !OrgUnit || OrgUnit.length==0 )
           {
               OrgUnit = organisationUnitTree;
           }


            dataCriteria.selectedOrgUnit = selectedOrgUnit;
            dataCriteria.selectedPeriod = selectedPeriod;
            return dataCriteria;
        };


       portalService.getDistrictsFromTree = function(orgUnits){
            angular.forEach(orgUnits,function(orgUnit){
                if(orgUnit.children){
                    portalService.getDistrictsFromTree(orgUnit.children);
                }else{
                    portalService.districts.push(orgUnit);
                }

            });
            return portalService.districts;
        }


       portalService.getPeriod = function(){

           var start_period = 2011;

           var date = new Date();
           var periods = [];
           var thisyear = date.getFullYear();
           for(var i=Number(thisyear);i>=Number(start_period);i--){
               periods.push({name:i,value:i})
           }
           return periods;
       };

       portalService.getSelectedOrgUnitNames = function(selectedItems,treeStructure){
           var names = '';


           if ( selectedItems )
           {

               var orgunitCount = selectedItems.length;

               if (orgunitCount.length > 0 )
               {
                   names = treeStructure[0].name;
               }
               else
               {
                   angular.forEach(selectedItems,function(value,index){
                       names+=value.name;
                       if ( index == orgunitCount-1 )
                       {

                       } else {
                           names+=",";
                       }
                   })
               }



           }


           return names;
       };
       portalService.getSelectedOrgUnit = function(selectedItems,treeStructure){
           var orgunits = '';


           if ( selectedItems )
           {

               var orgunitCount = selectedItems.length;

               if (orgunitCount > 0 )
               {
                   orgunits = treeStructure[0].id;
               }
               else
               {
                   angular.forEach(selectedItems,function(value,index){
                       orgunits+=value.id;
                       if ( index == orgunitCount-1 )
                       {

                       } else {
                           orgunits+=";";
                       }
                   })
               }



           }


           return orgunits;
       };

       portalService.getSelectedOrgUnitLevel = function(selectedItems,treeStructure){
         var level = 'District';


         if ( selectedItems )
         {

             var orgunitCount = selectedItems.length;
             if (orgunitCount == 1 )
             {

                 if ( selectedItems[0].children && selectedItems[0].children[0]) {

                   if ( selectedItems[0].children[0].name.indexOf('Region') >=0 )
                   {
                     level = 'National';
                   }

                   if ( selectedItems[0].children[0].name.indexOf('District') >=0 )
                   {
                    level = 'Regional';
                   }

                 }
             }
             else
             {
                 level = '';
             }



         }

         return level;
       }


       portalService.getApproppiateTreeClass = function(selectedItems,treeStructure){
         var classess = "m2 l2"
         if (selectedItems ){
            var orgUnitsCount = selectedItems.length;console.log(orgUnitsCount)

            if ( orgUnitsCount == 1 )
             {
              classess = "m2 l2";
             }
             else
           if ( orgUnitsCount == 2 )
            {
             classess = "m3 l3";
            }
            else
           if ( orgUnitsCount >= 3 && orgUnitsCount < 5 )
            {
              classess = "m"+orgUnitsCount+" l"+orgUnitsCount;
            }
            else
            {
              classess = "m4 l4"
            }

         }

         return classess
       }


       portalService.getApproppiateLoginClass = function(selectedItems,treeStructure){
         var classess = "m8 l8";
         if (selectedItems ){
            var orgUnitsCount = selectedItems.length;

            if ( orgUnitsCount == 1 )
             {
              classess = "m8 l8";
             }
            else
            if ( orgUnitsCount < 4 && orgUnitsCount >= 2 )
             {
              classess = "m7 l7";
             }
            else
            {
              classess = "m6 l6"
            }

         }
         console.log(classess);

         return classess
       }


        return portalService;
    })
   .service('mapService',function(){
      var mapService = {}

      mapService.getParentPloygon = function(organisationUnits){
        var feature = {
                        type: "Feature",
                        properties: {
                          name:organisationUnits[0].name
                        },
                        geometry: {
                          type: "MultiPolygon",
                          coordinates: eval(organisationUnits[0].coordinates)
                        }
                    };
        return feature;
      }

      function checkForProfile(item,filesArray){
        var returnValue = false;
          if ( item.name.indexOf('MOH') >= 0 )
          {
            returnValue = false;
          }else{
            var childrenOrgUnit = item.name.split(" ");

            if ( childrenOrgUnit[1] == "Region" ) {

              angular.forEach(filesArray,function(files){
                 if ( files.indexOf('MOH - Tanzania_'+childrenOrgUnit[0]) >= 0 )
                 {
                   returnValue = true;
                   return;
                 }

              })
            }
            else
            if ( childrenOrgUnit[1] == "District" || childrenOrgUnit[1] == "Municipal" || childrenOrgUnit[1] == "Town") {

              angular.forEach(filesArray,function(files){
                 if ( files.indexOf(childrenOrgUnit[0]) >= 0 )
                 {
                   returnValue = true;
                 }

              })
            }

          }

        return returnValue;
      }
      mapService.getOtherPolygons = function(geoJsonObject,selectedItems,files){

                angular.forEach(selectedItems,function(item){

                    var feature = {
                                    type: "Feature",
                                    properties: {
                                      name:item.name,
                                      hasProfile:checkForProfile(item,files)
                                    },
                                    geometry: {
                                      type: "MultiPolygon",
                                      coordinates: eval(item.coordinates)
                                    }
                                };

                  geoJsonObject.data['features'].push(feature);

                  if ( item.children )
                  {

                    angular.forEach(item.children,function(childItem){

                      if ( childItem.coordinates )
                      {
                          var feature = {
                                          type: "Feature",
                                          properties: {
                                            name:childItem.name,
                                            hasProfile:checkForProfile(childItem,files)
                                          },
                                          geometry: {
                                            type: "MultiPolygon",
                                            coordinates: eval(childItem.coordinates)
                                          }
                                      };

                        geoJsonObject.data['features'].push(feature);
                      }

                    });
                  }


                })

                return geoJsonObject;
      }


      return mapService;
   })
