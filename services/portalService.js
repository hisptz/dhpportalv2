/**
 * Created by kelvin on 11/16/15.
 */
angular.module("dhpportal")
   .service('portalService',function($http,$resource,utilityService,$q) {

        var self = this;
        //initializing shared data
        self.period = '';
        self.orgUnitId = '';
        self.header='';
        self.base = "https://hmisportal.moh.go.tz/training/";
        self.icons = [
            {name: 'table', image: 'table.jpg', action: ''},
            {name: 'bar', image: 'bar.png', action: ''},
            {name: 'line', image: 'line.png', action: ''},
            {name: 'combined', image: 'combined.jpg', action: ''},
            {name: 'column', image: 'column.png', action: ''},
            {name: 'area', image: 'area.jpg', action: ''},
            {name: 'pie', image: 'pie.png', action: ''},
            {name: 'map', image: 'map.jpg', action: ''}
        ];

        self.completeness_data = "Pc2t6Tq5era";
        self.dataelements = self.completeness_data+";zAdZOnBiRrA;zIwKAzcrVKp;zX519YXI6fs;zak0lGrQJ6c;zpaRMmTSNy4;zyQtfPPPHBz";

        self.mainObject = {};
        self.districts = [];

        self.authenticateDHIS = function () {
            return utilityService.login("Demo","DEMO2016");
        };


        self.getProjects = function(orgUnits){
            angular.forEach(orgUnits,function(orgUnit){
                if(orgUnit.children){
                    self.getProjects(orgUnit.children);
                }else{
                    self.districts.push(orgUnit);
                }

            });
            return self.districts;
        }


        return self;
    })