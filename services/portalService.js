/**
 * Created by kelvin on 11/16/15.
 */
angular.module("dhpportal")
   .service('portalService',function($http,$resource,$q) {

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
        self.authenticateDHIS = function () {
            var deferred = $q.defer();
            $.post( self.base + "dhis-web-commons-security/login.action?authOnly=true", {
                j_username: "Demo", j_password: "DEMO2016"
            },function(response){
                deferred.resolve(response);
            },function(){
                deferred.reject();
            });

            return deferred.promise;
        };

        return self;
    })