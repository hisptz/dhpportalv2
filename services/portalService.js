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

               if (orgunitCount.length > 0 )
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

        return portalService;
    })