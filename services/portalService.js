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
