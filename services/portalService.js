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
        self.dataelements = self.completeness_data+";zAdZOnBiRrA;zIwKAzcrVKp;zX519YXI6fs;zak0lGrQJ6c;zpaRMmTSNy4;zyQtfPPPHBz;SOvrukGNHTh;noVZ2nC0cd5;COxxxIMwGQi;3VP63C8Mi;yTZHRoxXEx9;ZqcsT5tV8PF;cWIeT1zQlRt;eWE7vs7aiTu;vVx4cnzeYuP;kHtC3VdLHo7;eflMnKfoGPr;PJ2E7P6ttK8;IyYYHTT74Qg;rywiKuhcXhi;Pcly4O4zwMP;vYOcXPnPkwG;Fw0Oi3mnCxq;O9JWxhhhpUL;hUDp8nEM9Xu;ah6hNUZbKGw;rJGgyqtOFqS;wYxHjV46Aam;D0rd3jqvJhj;TgG1AVvdY6N;sbf2nYVcjcz;Z9NTYlGv5xq;FsdeelM8RBt;QfeqQeCDTYp;i6g11NJiXp5;R40i7n5fP73;n7Nol8M8dki;kLSuPxhQZ83;IrjePU1LBSM;BiBYNFnGQF5;xUrTxNMdhwZ;MyAjPcTegFP;waYaK9vNvqv;pPugLQdSVz7;kkp0SNYElja;sGaikF65k9K;IhtgXBLgmWo;bOTP4YwW9Kj;zpaRMmTSNy4;e8VlGMUjzrx;UdLMaIAsYCI;PcVgAFPeQv8;qcxiBNr7Xt4;hO3yij1X18H;RVkwaoJPKZb;NcZ9vAFC5aw;NBalZwwnTCA;hgcgwMD9dpO;xgyDTmVG3w9;DpbaaSfLucg;cHDQiQJRc3q;QeIvaNVBt7L;C0sro0yymAc;i10R7abb5e7;r18DK7WrGqq";
        self.indicators = "Y1pkrlq2hWi;uOOJi6b0pzm;BlZrj2FC6bG;Y1pkrlq2hWi;z9ispsHeYNw;TvgyTWvJamX;zIAxcoxZ3Pl;WhsP7nsuwnz;heyJnpx5b37;sxBx8Bone59;TdxVgoa08tn;qHpMHX3KWZn;ohw1MBklYkc";

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