/**
 * Created by kelvin on 11/16/15.
 */
angular.module("dhpportal")
   .service('portalService',function($http,$resource,$q) {

        var self = this;
        //initializing shared data
        this.period = '';
        this.orgUnitId = '';
        this.header='';
        this.base = "https://hmisportal.moh.go.tz/training/";
        this.icons = [
            {name: 'table', image: 'table.jpg', action: ''},
            {name: 'bar', image: 'bar.png', action: ''},
            {name: 'line', image: 'line.png', action: ''},
            {name: 'combined', image: 'combined.jpg', action: ''},
            {name: 'column', image: 'column.png', action: ''},
            {name: 'area', image: 'area.jpg', action: ''},
            {name: 'pie', image: 'pie.png', action: ''},
            {name: 'map', image: 'map.jpg', action: ''}
        ];
        this.authenticateDHIS = function () {
            var deferred = $q.defer();
            $.post( self.base + "dhis-web-commons-security/login.action?authOnly=true", {
                j_username: "Demo", j_password: "HMISDEMO2016"
            },function(response){
                deferred.resolve(response);
            },function(){
                deferred.reject();
            });

            return deferred.promise;
        };
    })