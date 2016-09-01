(function () {
    'use strict';

    angular
        .module('dhpportal')
        .service('dataService', dataService);
    dataService.$inject = ['$http','$q','profileService','utilityService'];
    function dataService($http,$q,profileService,utilityService) {
        var dataService = this;
        dataService.baseDHIS = profileService.baseDHIS;

        dataService.metaData = {
            dataElements:'Pc2t6Tq5era;zAdZOnBiRrA;zIwKAzcrVKp;zX519YXI6fs;zak0lGrQJ6c;zpaRMmTSNy4;zyQtfPPPHBz;SOvrukGNHTh;noVZ2nC0cd5;COxxxIMwGQi;3VP63C8Mi;yTZHRoxXEx9;ZqcsT5tV8PF;cWIeT1zQlRt;eWE7vs7aiTu;vVx4cnzeYuP;kHtC3VdLHo7;eflMnKfoGPr;PJ2E7P6ttK8;IyYYHTT74Qg;rywiKuhcXhi;Pcly4O4zwMP;vYOcXPnPkwG;Fw0Oi3mnCxq;O9JWxhhhpUL;hUDp8nEM9Xu;ah6hNUZbKGw;rJGgyqtOFqS;wYxHjV46Aam;D0rd3jqvJhj;TgG1AVvdY6N;sbf2nYVcjcz;Z9NTYlGv5xq;FsdeelM8RBt;QfeqQeCDTYp;i6g11NJiXp5;R40i7n5fP73;n7Nol8M8dki;kLSuPxhQZ83;IrjePU1LBSM;BiBYNFnGQF5;xUrTxNMdhwZ;MyAjPcTegFP;waYaK9vNvqv;pPugLQdSVz7;kkp0SNYElja;sGaikF65k9K;IhtgXBLgmWo;bOTP4YwW9Kj;zpaRMmTSNy4;e8VlGMUjzrx;UdLMaIAsYCI;PcVgAFPeQv8;qcxiBNr7Xt4;hO3yij1X18H;RVkwaoJPKZb;NcZ9vAFC5aw;NBalZwwnTCA;hgcgwMD9dpO;xgyDTmVG3w9;DpbaaSfLucg;cHDQiQJRc3q;QeIvaNVBt7L;C0sro0yymAc;i10R7abb5e7;r18DK7WrGqq',
            completeness:'Pc2t6Tq5era',
            indicators:'Y1pkrlq2hWi;uOOJi6b0pzm;BlZrj2FC6bG;Y1pkrlq2hWi;z9ispsHeYNw;TvgyTWvJamX;zIAxcoxZ3Pl;WhsP7nsuwnz;heyJnpx5b37;sxBx8Bone59;TdxVgoa08tn;qHpMHX3KWZn;ohw1MBklYkc',
            automatedIndicators:'ELLbdOFMLWJ;yho46pwbbNQ;TRoamv0YPt3;QiA9L6tNHFy;qHpMHX3KWZn;c29EE9nH8gQ;WhsP7nsuwnz',
            dataDeliveryIndicators:'heyJnpx5b37;sxBx8Bone59;TvgyTWvJamX;QG9qsX5DkwG;yho46pwbbNQ;WhsP7nsuwnz;qHpMHX3KWZn;D1ajYTD7PWQ;q06r0G4AOUV',
            dataDistributionIndicators:'Y1pkrlq2hWi;BlZrj2FC6bG;bzTuXoKa87E;TdxVgoa08tn;uOOJi6b0pzm;Qs5gUtaelJn',
            topTenMortalityIndicators:'A0q2I8nTWcV:IN%3AA00%20-%20Cholera%3BA01%20-%20Typhoid%3BA01%20-%20Typhoid%20fever%20(salmonellosis)%3BA06%20-%20Dysentery%20Acute%2FChronic%3BA09%20-%20Diarrhoea%3BA15%20-%20TB%20Confirmed%3BA16%20-%20TB%20Not%20confirmed%3BA20%20-%20Plague%3BA33%20-%20Tetanus%2C%20Neonatal%3BA41%20-%20Septicaemia%3BA75%20-%20Relapsing%20Fever%20(Louse%20borne%20Typhus)%3BB05%20-%20Measles%3BB24%20-%20HIV%20and%20AIDS%3BB45%20-%20Meningitis%20Cryptococal%3BB53%20-%20Malaria%20confirmed%3BB54%20-%20Malaria%20presumptive%3BC80%20-%20Neoplasm%3BG03%20-%20Meningitis%3BG04%20-%20Encephalitis%3BG83%20-%20Acute%20Flaccid%20Paralysis%3BI50%20-%20Heart%20failure%3BJ06%20-%20Respiratory%20Infection%20Acute%20(ARI)%3BJ18%20-%20Pneumonia%3BJ45%20-%20Asthma%3BJ81%20-%20Pulmonary%20oedema%3BJ98%20-%20Pneumopathies%3BK75%20-%20Hepatitis%3BL08%20-%20Skin%20infections%3BR09%20-%20Pleurisy%20(non-Tuberculosis)%3BR50%20-%20Fever%20Chronic%20(%3E%201%20month)%3BS09%20-%20Head%20injury%3BS36%20-%20Ruptured%20spleen%3BT14%20-%20Fractures%3BT14.9%20-%20Trauma%20Other%3BT30%20-%20Burns%3BC22%20-%20Cancer%20Liver%3BC46%20-%20Kaposi%60s%20sarcoma%3BC50%20-%20Cancer%20Breast%3BC55%20-%20Cancer%20Uterine%3BC61%20-%20Cancer%20Prostate%3BC80%20-%20Tumours%20Other%20malignant%3BD48%20-%20Tumours%20Other%20non-malignant%3BE14%20-%20Diabetes%3BI10%20-%20Hypertension%3BI42%20-%20Cardiomyopathy%3BI64%20-%20Cerebrovascular%20accident%3BA80%20-%20Acute%20Flacid%20Paralysis%20(polio)%3BK25%20-%20Ulcer%2C%20gastro-duodenal%3BK29%20-%20Gastritis%3BK37%20-%20Appendicitis%3BK46%20-%20Hernia%3BK56%20-%20Intestinal%20occlusion%3BK65%20-%20Peritonitis%20(non-Tuberculosis)%3BK74%20-%20Cirrhosis%20of%20the%20liver%3BK92%20-%20Digestive%20tract%20Haemorrhages%3BM86%20-%20Bone%20infections%20(including%20osteomyelitis)%3BM89%20-%20Bone%20and%20joint%20disease%20other%3BN04%20-%20Nephrotic%20syndrome%3BN05%20-%20Glomerulonephritis%3BN15%20-%20Kidney%20infections%3BN39%20-%20Urinary%20tract%20infections%3BN94%20-%20Gynecological%20problems%3BB24%20-%20Paediatric%20AIDS%3BP05%20-%20Low%20birth%20weight%20or%20Prematurity%20Complication%3BP15%20-%20Birth%20trauma%3BP21%20-%20Neonatal%20Asphyxia%3BP22%20-%20Respiratory%20distress%3BP23%20-%20Pneumonia%3BP36%20-%20Neonatal%20Septicaemia%3BP37%20-%20Malaria%20%E2%80%93%20Neonatal%3BP54%20-%20Haemorrhage%20%E2%80%93%20Neonatal%3BP74%20-%20Dehydration%3BP78%20-%20Diarrhoea%20%E2%80%93%20Neonatal%3BP95%20-%20Stillbirth%20(fresh)%3BP95%20-%20Stillbirth%20(macerated)%3BP95%20-%20Stillbirth%3BQ05%20-%20Congenital%20hydrocephalus%20and%20spinal%20bifida%3BQ24%20-%20Congenital%20malformation%20of%20the%20heart%3BQ89%20-%20Other%20congenital%20malformation%3BR95%20-%20Sudden%20infant%20death%20syndrome%3BX49%20-%20Accidental%20poisoning%20by%20and%20exposure%20to%20noxious%20substances%3BY09%20-%20Assault%3BO06%20-%20Abortion%3BO16%2FO15%20-%20Severe%20Hypertension%20in%20pregnancy%2F%20eclampsia%3BO46%20-%20Antepartum%20Haemorrhage%3BO66%20-%20Obstructed%20Labour%3BO71%20-%20Rupture%20uterus%3BO72%20-%20Post-partum%20haemorrhage%3BO75%20-%20Unknown%20fever%3BO75%20-%20Local%20herbs%20in%20Pregnancy%3BO85%20-%20Puerperal%20Sepsis%20%2FSepticaemia%3BO98%20-%20Malaria%20in%20pregnancy%3BO99%20-%20Anaemia%20in%20Pregnancy%3BO99%20-%20Pneumonia%20in%20pregnancy%3BO99%20-%20Pulmonary%20oedema%3BO99%20-%20Meningitis%3BO99.4%20-%20Cardiomyopathy%20in%20Pregnancy%3BZ21%20-%20Asymptomatic%20HIV%3BT29%20-%20Burns%20and%20corrosions%20of%20multiple%20body%20regions',
            topTenAdmission:'ACM4BHrKZNQ;AKeayZWILrh;BwJsDwQayqN;C2Rg2uPfbhs;CNzWVlVeOdx;CWXG9lBSI7Y;ClHcTEiVMpb;CpP8znGTTWi;DWWNT5pcrWf;EEeh0pyQISB;FkKfVoslpKi;Fuwwc9CgYUN;GQwVaLxM9Gs;GqSZits9IeK;H2R0UdSYRPn;HWZmyu3j4NX;IJAImvSE7P6;ItK93OX9wyu;KlePTLpBdWd;Kpa6sheYah0;LD4thW4OmXi;Lcj8osNjKQx;MG98iWgxXNT;MOYDHlGVOZi;MwnLlVZZJkU;NLBkuHemCAx;NRmqyxps5ZA;NSYWPEpZBuY;NlXYR3IJWCl;NwzMLHAFMSC;O9HZJ5frgiJ;PxPfeeZz5eI;Q5AQcGLeh7y;Qhi9QXHzP9b;QhpE8F5apCj;QqqAeR0wrwS;QtBqSDM3YCN;RifXFxv1lQq;RlEchOC92Yr;Rlr4Y8hOejL;RppK9y0dY08;SAD8J9zO6MF;SgeSIiqTN2l;ShxnDczlruP;SjNEefHqcz4;SxNQQBphBOS;TsLGQxidpbn;UlFUBEpJsSs;VHmWnicZtbQ;VSb3ctsTz4z;VmFo3tNlgIW;W5GuP81V3Zf;WSaSCvJTnfQ;WXuqsXyNq4K;Wa3cm09YbsP;Wyorktq1rUA;X0TXADJv7GA;Y6xpjIVTsJ7;Y7upeLGM36C;YVOid8f091G;Yut5amdi7iw;YzWIMlVnfxq;a9Pxllofrpx;anYwhLJV58B;aruodm4tcnY;avzBnVwWlV9;c4ZuqcOCyix;cGVl8WkpBTL;cUHWPSXirUl;ccIfQsrfWeL;ctT1j57B2OL;d8FSoimbeKH;eTOV59Rcv4F;eoZtkUbfrmF;f6Q9p6uSWtS;f8yQ5FUAIx0;fLjZYZB3tuB;fVzXb5qPrCp;fWq6ZXy0Uzp;fYO2JUHPdul;gNQ5NYT8SCz;hBSqV93WRL4;hO9LkFt8n2p;hufCs1tU1gs;iP9wSaCAZl5;jz1y4ru52rC;k3TGMJ3ru5y;kmpnqbSQLBl;kzj3RYX536Y;l1GL5Tmn22E;lJry1lLp3dJ;mE81BaLRP29;mMkFYcDVj3e;mcVhgPQtLLX;n611GaZn5Xr;o0KObJuu9Yu;pP6BsR5KiRM;pZr0OzykmJB;q3ELeLciuTh;qoeOTJT0x6o;s1GFhwCZaWq;s74ccDa9ZDM;sr87SW2uEmt;tM1ecc8qcsJ;tfDgtMmh9TU;uAa5OgHFwud;uqno4prZX61;uyQpafHrxLT;v6sdLtxvY1K;wULlcm4Qj5S;wwl4tRTnPEo;x5cswY9qs7m;xCl76XUXHb9;xsoXkeM69KC;yx1Ndv0hlhO;zQQFpz3JT6g;zfhmMA4HeJn;ziUz3NmWftW;zqaHIXl6j7c'

        }

        function getDataFromAnalytics(url){

            return $http.get(url).then(handleSuccess, handleError('Error loading analytics data'));

        }


        dataService.getPopulationData            = function(orgunit,period){
            return getDataFromAnalytics(dataService.baseDHIS+"api/analytics.json?dimension=Cow9nZikDgD:FfN1mqXvpR7;HKU7NijIEIH;LBipXEMD6mq;aZcKJ9XxvaF;h8JRv8POdfy;p1b4SYcdjJw&dimension=dx:ykShMtNgDB1&dimension=hENn80Fmmlf:mtUMlCLFTTz;syxWmui9UMq&filter=ou:"+orgunit+"&filter=pe:"+period);
        }

        dataService.getIndicatorDataDistribution = function(orgunit,period){
            var periodArray = utilityService.getConsecutivePeriods(period);
            var therIndicatorUrl = dataService.baseDHIS+"api/analytics.json?dimension=dx:"+dataService.metaData.dataDistributionIndicators+"&dimension=pe:"+periodArray+"&filter=ou:"+orgunit+"&displayProperty=NAME";
            return getDataFromAnalytics(therIndicatorUrl);
        }
        dataService.getIndicatorDataDelivery     = function(orgunit,period){
            var periodArray = utilityService.getConsecutivePeriods(period);
            var therIndicatorUrl = dataService.baseDHIS+"api/analytics.json?dimension=dx:"+dataService.metaData.dataDeliveryIndicators+"&dimension=pe:"+periodArray+"&filter=ou:"+orgunit+"&displayProperty=NAME";
            return getDataFromAnalytics(therIndicatorUrl);
        }
        dataService.getIndicatorDataSystem       = function(indicator,orgunit,period){
            var periodArray = utilityService.getConsecutivePeriods(period);
            var therIndicatorUrl = dataService.baseDHIS+"api/analytics.json?dimension=dx:"+indicator+"&dimension=pe:"+periodArray+"&filter=ou:"+orgunit+"&displayProperty=NAME";
            return getDataFromAnalytics(therIndicatorUrl);
        }

        dataService.getIndicatorTopTenMortality  = function(indicator,orgunit,period){
            var periodArray = utilityService.getConsecutivePeriods(period);
            var therIndicatorUrlYear = dataService.baseDHIS+'/api/analytics/events/aggregate/Mvc0jfU9Ua2.json?stage=mlDzRw3ibhE&dimension=pe:'+periodArray+'&dimension='+dataService.metaData.topTenMortalityIndicators+'&filter=ou:'+orgunit+'&outputType=EVENT&displayProperty=NAME';

            return getDataFromAnalytics(therIndicatorUrlYear);

        }
        dataService.getIndicatorTopTenAdmissions = function(orgunit,period){

            var periodArray = utilityService.getConsecutivePeriods(period);

            var therIndicatorUrlYear = dataService.baseDHIS+"api/analytics.json?dimension=dx:"+dataService.metaData.topTenAdmission+"&dimension=pe:"+periodArray+"&filter=ou:"+orgunit+"&displayProperty=NAME";
            return getDataFromAnalytics(therIndicatorUrlYear);

        }

        dataService.getAutomatedIndicator        = function(orgunit,period){
            var periodArray = utilityService.getConsecutivePeriods(period);
            var automatedUrl = dataService.baseDHIS+"api/analytics.json?dimension=dx:"+dataService.metaData.automatedIndicators+"&dimension=pe:"+periodArray+"&filter=ou:"+orgunit+"&displayProperty=NAME";

            return getDataFromAnalytics(automatedUrl);
        }



        dataService.refineTopTenAdmissionIndicators = function(analyticsObject,year){
            console.log("TOP TEN CAUSES OF DEATH");
            var periods = profile.getConsecutivePeriods(year);
            var output = [];
            var outputs = [];


            if ( analyticsObject.metaData )
            {
                var dataElement    = analyticsObject.metaData.dx;
                var names          = analyticsObject.metaData.names;
                var rows           = analyticsObject.rows;

                angular.forEach(dataElement,function(elementValue,elementIndex){
                    output[elementValue] = {name:names[elementValue]};
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

            var periods = profile.getConsecutivePeriods(year);
            var output = [];
            var outputs = [];


            var dataElement    = [];
            console.log(analyticsObject);
            if ( analyticsObject )
            {

                var period          = analyticsObject.metaData.pe;
                var rows           = analyticsObject.rows;



                angular.forEach(rows,function(rowValue,rowIndex){
                    if(typeof output[rowValue[0]]!="undefined"){

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

        dataService.assembleDataFromDHIS         = function(data,year){
            var periodString = utilityService.getConsecutivePeriods(year);
            var output = {}
            var periods = periodString.split(';');

            angular.forEach(periods,function(periodValue,periodIndex){
                output[periodValue] = {};
            });


        if ( data.metaData )
        {

            var dataElement    = data.metaData.dx;
            var names          = data.metaData.names;

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
            console.log('output',output);
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



    // private functions

    function handleSuccess(res) {
        return res.data;
    }

    function handleError(error) {
        return function () {
            return { success: false, message: error };
        };
    }

})();
