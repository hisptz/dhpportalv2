(function () {
    'use strict';

    angular
        .module('dhpportal')
        .service('dataService', dataService);
    dataService.$inject = ['$http','$q','profileService','utilityService','pendingRequestsService'];
    function dataService($http,$q,profileService,utilityService,pendingRequestsService) {
        var dataService = this;
        var canceller = $q.defer();
        dataService.baseDHIS = profileService.baseDHIS;

        dataService.metaData = {
            dataElements:'Pc2t6Tq5era;zAdZOnBiRrA;zIwKAzcrVKp;zX519YXI6fs;zak0lGrQJ6c;zpaRMmTSNy4;zyQtfPPPHBz;SOvrukGNHTh;noVZ2nC0cd5;COxxxIMwGQi;3VP63C8Mi;yTZHRoxXEx9;ZqcsT5tV8PF;cWIeT1zQlRt;eWE7vs7aiTu;vVx4cnzeYuP;kHtC3VdLHo7;eflMnKfoGPr;PJ2E7P6ttK8;IyYYHTT74Qg;rywiKuhcXhi;Pcly4O4zwMP;vYOcXPnPkwG;Fw0Oi3mnCxq;O9JWxhhhpUL;hUDp8nEM9Xu;ah6hNUZbKGw;rJGgyqtOFqS;wYxHjV46Aam;D0rd3jqvJhj;TgG1AVvdY6N;sbf2nYVcjcz;Z9NTYlGv5xq;FsdeelM8RBt;QfeqQeCDTYp;i6g11NJiXp5;R40i7n5fP73;n7Nol8M8dki;kLSuPxhQZ83;IrjePU1LBSM;BiBYNFnGQF5;xUrTxNMdhwZ;MyAjPcTegFP;waYaK9vNvqv;pPugLQdSVz7;kkp0SNYElja;sGaikF65k9K;IhtgXBLgmWo;bOTP4YwW9Kj;zpaRMmTSNy4;e8VlGMUjzrx;UdLMaIAsYCI;PcVgAFPeQv8;qcxiBNr7Xt4;hO3yij1X18H;RVkwaoJPKZb;NcZ9vAFC5aw;NBalZwwnTCA;hgcgwMD9dpO;xgyDTmVG3w9;DpbaaSfLucg;cHDQiQJRc3q;QeIvaNVBt7L;C0sro0yymAc;i10R7abb5e7;r18DK7WrGqq',
            completeness:'Pc2t6Tq5era',
            indicators:'Y1pkrlq2hWi;uOOJi6b0pzm;BlZrj2FC6bG;Y1pkrlq2hWi;z9ispsHeYNw;TvgyTWvJamX;zIAxcoxZ3Pl;WhsP7nsuwnz;heyJnpx5b37;sxBx8Bone59;TdxVgoa08tn;qHpMHX3KWZn;ohw1MBklYkc',
            automatedIndicators:'ELLbdOFMLWJ;yho46pwbbNQ;TRoamv0YPt3;QiA9L6tNHFy;qHpMHX3KWZn;c29EE9nH8gQ;WhsP7nsuwnz',
            dataDeliveryIndicators:'heyJnpx5b37;sxBx8Bone59;TvgyTWvJamX;QG9qsX5DkwG;yho46pwbbNQ;WhsP7nsuwnz;qHpMHX3KWZn;D1ajYTD7PWQ;q06r0G4AOUV',
            dataDistributionIndicators:'Y1pkrlq2hWi;BlZrj2FC6bG;bzTuXoKa87E;TdxVgoa08tn;uOOJi6b0pzm;Qs5gUtaelJn',
            topTenMortalityIndicators:'A0q2I8nTWcV',
            topTenAdmission:'ACM4BHrKZNQ;AKeayZWILrh;BwJsDwQayqN;C2Rg2uPfbhs;CNzWVlVeOdx;CWXG9lBSI7Y;ClHcTEiVMpb;CpP8znGTTWi;DWWNT5pcrWf;EEeh0pyQISB;FkKfVoslpKi;Fuwwc9CgYUN;GQwVaLxM9Gs;GqSZits9IeK;H2R0UdSYRPn;HWZmyu3j4NX;IJAImvSE7P6;ItK93OX9wyu;KlePTLpBdWd;Kpa6sheYah0;LD4thW4OmXi;Lcj8osNjKQx;MG98iWgxXNT;MOYDHlGVOZi;MwnLlVZZJkU;NLBkuHemCAx;NRmqyxps5ZA;NSYWPEpZBuY;NlXYR3IJWCl;NwzMLHAFMSC;O9HZJ5frgiJ;PxPfeeZz5eI;Q5AQcGLeh7y;Qhi9QXHzP9b;QhpE8F5apCj;QqqAeR0wrwS;QtBqSDM3YCN;RifXFxv1lQq;RlEchOC92Yr;Rlr4Y8hOejL;RppK9y0dY08;SAD8J9zO6MF;SgeSIiqTN2l;ShxnDczlruP;SjNEefHqcz4;SxNQQBphBOS;TsLGQxidpbn;UlFUBEpJsSs;VHmWnicZtbQ;VSb3ctsTz4z;VmFo3tNlgIW;W5GuP81V3Zf;WSaSCvJTnfQ;WXuqsXyNq4K;Wa3cm09YbsP;Wyorktq1rUA;X0TXADJv7GA;Y6xpjIVTsJ7;Y7upeLGM36C;YVOid8f091G;Yut5amdi7iw;YzWIMlVnfxq;a9Pxllofrpx;anYwhLJV58B;aruodm4tcnY;avzBnVwWlV9;c4ZuqcOCyix;cGVl8WkpBTL;cUHWPSXirUl;ccIfQsrfWeL;ctT1j57B2OL;d8FSoimbeKH;eTOV59Rcv4F;eoZtkUbfrmF;f6Q9p6uSWtS;f8yQ5FUAIx0;fLjZYZB3tuB;fVzXb5qPrCp;fWq6ZXy0Uzp;fYO2JUHPdul;gNQ5NYT8SCz;hBSqV93WRL4;hO9LkFt8n2p;hufCs1tU1gs;iP9wSaCAZl5;jz1y4ru52rC;k3TGMJ3ru5y;kmpnqbSQLBl;kzj3RYX536Y;l1GL5Tmn22E;lJry1lLp3dJ;mE81BaLRP29;mMkFYcDVj3e;mcVhgPQtLLX;n611GaZn5Xr;o0KObJuu9Yu;pP6BsR5KiRM;pZr0OzykmJB;q3ELeLciuTh;qoeOTJT0x6o;s1GFhwCZaWq;s74ccDa9ZDM;sr87SW2uEmt;tM1ecc8qcsJ;tfDgtMmh9TU;uAa5OgHFwud;uqno4prZX61;uyQpafHrxLT;v6sdLtxvY1K;wULlcm4Qj5S;wwl4tRTnPEo;x5cswY9qs7m;xCl76XUXHb9;xsoXkeM69KC;yx1Ndv0hlhO;zQQFpz3JT6g;zfhmMA4HeJn;ziUz3NmWftW;zqaHIXl6j7c'

        }

        var indicator = dataService.metaData.automatedIndicators+';'+dataService.metaData.dataDeliveryIndicators+';'+dataService.metaData.automatedIndicators+';'+dataService.metaData.indicators

        function getDataFromAnalytics(url){

            pendingRequestsService.add({url: url,canceller: canceller});
            return $http.get(url);

        }


        dataService.getPopulationData            = function(orgunit,period){
            return getDataFromAnalytics(dataService.baseDHIS+"api/analytics.json?dimension=Cow9nZikDgD:FfN1mqXvpR7;HKU7NijIEIH;LBipXEMD6mq;aZcKJ9XxvaF;h8JRv8POdfy;p1b4SYcdjJw&dimension=dx:ykShMtNgDB1&dimension=hENn80Fmmlf:mtUMlCLFTTz;syxWmui9UMq&filter=ou:"+orgunit+"&filter=pe:"+period);
        }


        dataService.getIndicatorTopTenMortality  = function(orgunit,period){
            var periods     = utilityService.getConsecutivePeriods(period);
            var therIndicatorUrlYear = dataService.baseDHIS+'/api/analytics/events/aggregate/Mvc0jfU9Ua2.json?stage=mlDzRw3ibhE&dimension=pe:'+periods+'&dimension='+dataService.metaData.topTenMortalityIndicators+'&filter=ou:'+orgunit+'&outputType=EVENT&displayProperty=NAME';

            return getDataFromAnalytics(therIndicatorUrlYear);

        }
        dataService.getIndicatorTopTenAdmissions = function(orgunit,period){

            var periods     = utilityService.getConsecutivePeriods(period);
            var therIndicatorUrlYear = dataService.baseDHIS+"api/analytics.json?dimension=dx:"+dataService.metaData.topTenAdmission+"&dimension=pe:"+periods+"&filter=ou:"+orgunit+"&displayProperty=NAME";
            return getDataFromAnalytics(therIndicatorUrlYear);

        }

        dataService.getAutomatedIndicator        = function(orgunit,period){
            var periods      = utilityService.getConsecutivePeriods(period);
            var automatedUrl = dataService.baseDHIS+"api/analytics.json?dimension=dx:"+indicator+"&dimension=pe:"+periods+"&filter=ou:"+orgunit+"&displayProperty=NAME";

            return getDataFromAnalytics(automatedUrl);
        }



        dataService.refineTopTenAdmissionIndicators = function(analyticsObject,year){

            var period  = utilityService.getConsecutivePeriods(year);
            var periods = period.split(';');
            var output  = [];
            var outputs = [];


            if ( typeof analyticsObject.metaData == 'object' )
            {
                var dataElement    = analyticsObject.metaData.dx;
                var names          = analyticsObject.metaData.names;
                var rows           = analyticsObject.rows;

                angular.forEach(dataElement,function(elementValue,elementIndex){
                    output[elementValue]             = {name:names[elementValue]};
                    output[elementValue][periods[0]] = 0;
                    output[elementValue][periods[1]] = 0;
                    output[elementValue][periods[2]] = 0;
                });

                angular.forEach(rows,function(rowValue,rowIndex){
                    output[rowValue[0]][rowValue[1]] = Number(rowValue[2]);
                });


                angular.forEach(dataElement,function(elementValue,elementIndex){
                    outputs.push(output[elementValue]);

                });
            }



            return outputs;
        }
        dataService.refineTopTenMoltalityIndicators = function(analyticsObject,year){
            var period  = utilityService.getConsecutivePeriods(year);
            var periods = period.split(';');
            var output  = [];
            var outputs = [];


            var dataElement    = [];

            if ( typeof analyticsObject.metaData == 'object' )
            {

                var period          = analyticsObject.metaData.pe;
                var rows            = analyticsObject.rows;

                angular.forEach(rows,function(rowValue,rowIndex){
                    if( typeof output[rowValue[0]] != "undefined" ){

                    }else{
                        output[rowValue[0]] = {name:rowValue[0]};
                        output[rowValue[0]][periods[0]] = 0;
                        output[rowValue[0]][periods[1]] = 0;
                        output[rowValue[0]][periods[2]] = 0;
                    }

                });

                angular.forEach(rows,function(rowValue,rowIndex){
                    dataElement.push(rowValue[0]);
                    output[rowValue[0]][rowValue[1]] = Number(rowValue[2]);
                });


                angular.forEach(dataElement,function(elementValue,elementIndex){
                    outputs.push(output[elementValue]);

                });

            }




            return outputs;
        }

        dataService.createPopulationObject       = function(data){
            var output = {male:{},female:{}};

            if  ( data.metaData )
            {
                var categoryOption = data.metaData.co;
                var agePopulation  = data.metaData.Cow9nZikDgD;
                var jinsi          = data.metaData.hENn80Fmmlf;
                var dataElement    = data.metaData.dx;
                var names          = data.metaData.names;
                var rows           = data.rows;

                angular.forEach(jinsi,function(value,index){


                    angular.forEach(agePopulation,function(valuex,indexs){

                        angular.forEach(rows,function(rowValue,rowIndex){
                            if(rowValue[0]==dataElement&&rowValue[1]==valuex&&rowValue[2]==value){
                                if(names[value]=='KE'){output.female[names[valuex]] = dataService.toNormalize(rowValue[3]);}
                                if(names[value]=='ME'){output.male[names[valuex]] = dataService.toNormalize(rowValue[3]);}
                            }
                        })

                    });

                });

            }

            return output;
        }

        dataService.formatDataForTree  =  function(files,organisationUnitTree) {

                    var treeData = {name:'Archive',children:[{name:organisationUnitTree[0].name,children:null}]};
                       var regions = [];
                       var regionsArray = [];

                      for (var i = 2;i<files.length;i++) {
                       var fileArray = files[i].split('_');
                        if (regions.indexOf(fileArray[1])>=0){

                         }else{
                           regions.push(fileArray[1]);
                           regionsArray.push({name:fileArray[1],children:[]});
                        }

                      }

                         for (var r = 0;r<regions.length;r++) {


                    for (var i = 2;i<files.length;i++) {
                       var fileArray = files[i].split('_');
                         if (regions[r] == fileArray[1]) {
                             regionsArray[r].children.push({name:fileArray[2]+" profile",url:'uploads/'+files[i]});
                         }
                        }

                      }

                    treeData.children[0].children  = regionsArray;
                  return treeData;
         }

        dataService.assembleDataFromDHIS         = function(data,year){
            var periodString = utilityService.getConsecutivePeriods(year);
            var output = [];
            var periods = periodString.split(';');

            angular.forEach(periods,function(periodValue,periodIndex){
                output[periodValue] = {};
            });


              if ( data.metaData )
              {

                  var dataElement    = data.metaData.dx;
                  var names          = data.metaData.names;
                  var rows           = data.rows;

                  angular.forEach(dataElement,function(elementValue,elementIndex){

                      angular.forEach(output,function(valueOutput,indexOutput){
                          angular.forEach(rows,function(valueRow,indexRow){

                              if(indexOutput==rows[indexRow][1]){
                                  if(elementValue==rows[indexRow][0]){
                                      output[indexOutput][names[elementValue]] = rows[indexRow][2];
                                  }
                              }
                          });
                      });

                  });


              }

            return output;
        }


        dataService.loadAllFiles = function(){
            var url = '/dhpportal/server/process.php?list_files=1';

            return getDataFromAnalytics(url);
        }

        dataService.toNormalize = function(data){

            var theIndex = data.indexOf('E');

            if ( theIndex >= 0 )
            {
               var base =  data.substring(theIndex+1,data.length);
               data =  data.substring(0,theIndex);

                data = (data*Math.pow(10, base)).toFixed(0)
            }else{
                data = (Number(data)).toFixed(0);
            }
                return data;
        }

        return dataService;
    }

    dataService.getDataObject = function(data){

      return data.data;
    }


    function pushChildrens(treeData,singleFileArray){

      angular.forEach(treeData.children,function(value,index){
          if (value.name == singleFileArray[1]) {
            treeData.children[index];
          }else{
            if ( treeData.children.length == index+1 ) {
              treeData.children.push({name:singleFileArray[1],children:[]});
            }
          }
      })

      return treeData;
    }



    // private functions

    function handleSuccess(res) {
        return res.data;
    }

    function handleError(error) {
        return function () {
            return error;
        };
    }

})();
