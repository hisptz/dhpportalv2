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

        self.districts = [];

        self.authenticateDHIS = function () {
            return utilityService.login("Demo","DEMO2016");
        };

        self.prepareOrgunitUidsFromTree = function(treeobjects){
            var orgunitstring = "";
            var parentsnames = "";
            var object = [];
                angular.forEach(treeobjects,function(value){
                    parentsnames+=" "+value.name;
                    object.push(getChildren(value));
                })

                angular.forEach(object,function(value){
                    console.log(object);
//                    orgunitstring+=value.id+";";
                });


            return [parentsnames,orgunitstring];
        }

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

        var refresh = 0;
        var childresn = []
        function getChildren(objects){
            if(childresn.length>166){
                childresn = [];
            }
            if(objects.children!=null){
                angular.forEach(objects.children,function(value){
                    if(value.children!=null){
                        return getChildren(value);
                    }else{
                        childresn.push({id:value.id,name:value.name});
                    }
                })
            }else{
                childresn.push({id:objects.id,name:objects.name});
            }
            return childresn;
        }

        return self;
    })