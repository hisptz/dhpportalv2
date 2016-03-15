/**
 * Created by leo on 11/11/15.
 */
/**
 * THE BEGINNING OF MAP CONTROLLER FUNCTION
 * */

(function() {
    'use strict';

    angular
        .module('dhpportal')
        .config(function($httpProvider) {
            $httpProvider.defaults.withCredentials = true;
        })
        .controller('adminController', adminController);

    adminController.$inject   = ['$scope','$rootScope','$cookies', '$http','$q','$timeout', 'olData','olHelpers','shared','profileService','DTOptionsBuilder','Upload','utilityService'];
    function adminController($scope,$rootScope,$cookies, $http,$timeout,$q, olData,olHelpers,shared,profileService,DTOptionsBuilder,Upload,utilityService) {
        var admin = this;
        var date = new Date();
        admin.current_year = date.getFullYear();
        admin.list = true;
        admin.addProfileForm = false;
        admin.loadingUpload = false;
        admin.editProfileForm = false;
        admin.criteria = false;
        admin.criteriaPreview = false;
        admin.districtSelector = false;
        admin.profiles = null;
        admin.current_pdf_link = "uploads/";
        admin.districtName = [];
        admin.selectedOrgUnit = null;
        admin.selectedOrgUnitList = null;
        admin.tanzania = "Tanzania";
        admin.selectedOrgUnitToDisplay = admin.tanzania;
        admin.selectedPeriod = admin.current_year;
        admin.periodCriteria = admin.current_year;
        admin.regions = [];
        admin.districts = [];
        admin.districtsOnly = [];
        admin.csvfile = null;
        admin.pdffile = null;
        admin.profile = {};

        if(!$scope.$parent.currentLogedUser){
            window.location.href="#home";
        }
        /**
        * THE BEGINNING OF THE FUNCTION THAT HANDLES ADMIN PAGE FUNCTIONALITY OF PORTAL
        * */

        utilityService.getDataElements().then(function(data){
            utilityService.prepareDataElementUid(data);
            utilityService.prepareDataElementNames(data);
        });

        admin.showList = function(){
            admin.editProfileForm = false;
            admin.addProfileForm = false;
            admin.list = true;
            admin.uploadcsv = false;
            admin.drawTable(admin.current_year,admin.selectedOrgUnitToDisplay);

            $('select').material_select();

        }

        admin.home = function(){
            window.location.href = "#/home";
        }

        //
        //admin.drawTable = function(year,orgUnit){
        //    if(orgUnit==admin.tanzania){
        //        profileService.listProfileByYear(year).then(function(data){
        //            admin.profiles = data;
        //        },function(response){
        //            console.log(response);
        //        });
        //    }else{
        //        profileService.listProfileByOrgUnitAndPeriod(year,orgUnit).then(function(data){
        //            admin.profiles = data;
        //        },function(response){
        //            console.log(response);
        //        });
        //    }
        //
        //}
        //
        //admin.showList();
        //
        //admin.districtSelection = function(){
        //    if(typeof(admin.selectedOrgUnitRegion)!=="undefined"){
        //        if(admin.districtSelector){
        //            admin.districtSelector = false;
        //            admin.selectedOrgUnitToDisplay = JSON.parse(admin.selectedOrgUnitRegion).value;
        //        }else{
        //            admin.districtSelector = true;
        //        }
        //    }
        //
        //}
        //
        admin.showDistricts = function(district){

            admin.districts = JSON.parse(district).children;
        };


        $scope.$watch("admin.selectedOrgUnitRegion",function(newValue,oldValue){
            if(typeof(newValue) !=="undefined"){
                admin.showDistricts(newValue);
                admin.selectedOrgUnitToDisplay = JSON.parse(newValue).value;
                //admin.drawTable(admin.selectedPeriod,admin.selectedOrgUnitToDisplay);
            }
        });

        $scope.$watch("admin.selectedEntryRegion",function(newValue,oldValue){
            if(typeof(newValue)!=="undefined"){
                admin.showDistricts(newValue);
            }
        });

        $scope.$watch("admin.selectedOrgUnitDistrict",function(newValue,oldValue){
            if(typeof(newValue) !=="undefined"){
                admin.selectedOrgUnitToDisplay = JSON.parse(admin.selectedOrgUnitRegion).value+" -> "+newValue.split("_")[1];
                var district = getDirstrictName(admin.selectedOrgUnitToDisplay);
                //admin.drawTable(admin.selectedPeriod,district);
            }
        });

        $scope.$watch("admin.selectedPeriod",function(newValue,oldValue){
            if(typeof(newValue) !=="undefined"){
                //admin.drawTable(newValue,admin.selectedOrgUnitToDisplay);
            }
        });


        //admin.newProfile = function(){
        //    admin.editProfileForm = false;
        //    admin.addProfileForm = true;
        //    admin.list = false;
        //    admin.uploadcsv = false;
        //    admin.previewcsv = false;
        //
        //}
        //
        admin.saveProfile = function(form,pdf_file,orgUnit){
            admin.editProfileForm = false;
            admin.addProfileForm = true;
            admin.list = false;
            admin.uploadcsv = false;
            admin.previewcsv = false;

            angular.forEach(admin.districts,function(value,index){
                if(value.id==orgUnit){
                    form.org_unit_selected = value.name;
                    return false;
                }

            });

            var payload = {file_name:form.org_unit_selected+"_"+form.form_period+".pdf",file_object:pdf_file};
            if(!admin.selectedEntryDistrict&&!form.form_period){

            }else{
                profileService.saveProfile(payload).then(function(data){
                    admin.showProgress = false;
                    if(data=="UPLOAD_FAILED"){
                        admin.loadingUpload = false;
                        admin.message = "upload failed";
                        admin.message_class = "failed";
                    }

                    if(data=="UPLOAD_SUCCESS"){
                        admin.loadingUpload = false;
                        admin.showList();
                        admin.message = "uploaded successful";
                        admin.message_class = "success";
                    }

                    if(data=="FILE_EXIST_ERROR"){
                        admin.loadingUpload = false;
                        admin.message = "file exist";
                        admin.message_class = "failed";
                    }

                    if(data=="INVALID_TYPE_ERROR"){
                        admin.message = "file is not pdf";
                        admin.message_class = "failed";
                    }

                },function(response){
                    console.log("NETWORK ERROR");
                    admin.loadingUpload = false;
                    admin.message = "Upload failed: internal server error";
                    admin.message_class = "failed";
                });
            }

        }

        admin.editProfile = function(profile){
            admin.editProfileForm = true;
            admin.addProfileForm = false;
            admin.list = false;
            admin.uploadcsv = false;
            admin.previewcsv = false;
            var properties = utilityService.getPropertiesArray(profile);
            admin.editedParrentOrgUnit = properties.region;
            admin.editedOrgUnit = properties.district;
            admin.editedYear = properties.year;
        }
        admin.cancelUpdate = function(){
            admin.editProfileForm = false;
            admin.addProfileForm = false;
            admin.list = true;
            admin.uploadcsv = false;
            admin.previewcsv = false;
        }

        admin.openCriteria = function(){
            if(admin.criteria){
                admin.criteria = false;
            }else{
                admin.criteria = true;
            }
        }

        admin.deleteProfile = function(profile){
            profileService.delete(profile).then(function(data){
                admin.showList();
            },function(response){

            });
        }

        admin.getDistrictName = function(profile){
            admin.districtName.push(profile);
            return admin.districtName;

        }

        admin.filterProfiles = function(criteria){

            /** Target */
            admin.profile.maternal_mortality_target = 0;
            admin.profile.incidence_of_low_birth_weight_target = 0;
            admin.profile.neonatal_mortality_target = 0;
            admin.profile.infant_mortality_rate_target = 0;
            admin.under5_mortality_rate_target = 0;
            admin.incidence_of_malaria_laboratory_confirmed_cases_target = 0;
            admin.HIV_prevalence_in_15_to_24_years_age_group_target = 0;
            admin.Top_10_cases_of_admission_target = 0;
            admin.Top_10_causes_of_death_target = 0;
            admin.OPD_attention_target = 0;
            admin.Proportion_of_children_under_1_year_vaccinated_against_measles_target = 0;
            admin.Proportion_of_under_1_year_3rd_polio_target = 0;

            /** Years */
            admin.profile.maternal_mortality = {first_year:0,second_year:0,third_year:0};
            admin.profile.incidence_of_low_birth_weight = {first_year:0,second_year:0,third_year:0};
            admin.profile.neonatal_mortality = {first_year:0,second_year:0,third_year:0};
            admin.profile.infant_mortality_rate = {first_year:0,second_year:0,third_year:0};
            admin.under5_mortality_rate = {first_year:0,second_year:0,third_year:0};
            admin.incidence_of_malaria_laboratory_confirmed_cases = {first_year:0,second_year:0,third_year:0};
            admin.HIV_prevalence_in_15_to_24_years_age_group = {first_year:0,second_year:0,third_year:0};
            admin.Top_10_cases_of_admission = {first_year:0,second_year:0,third_year:0};
            admin.Top_10_causes_of_death = {first_year:0,second_year:0,third_year:0};
            admin.OPD_attention = {first_year:0,second_year:0,third_year:0};
            admin.Proportion_of_children_under_1_year_vaccinated_against_measles = {first_year:0,second_year:0,third_year:0};
            admin.Proportion_of_under_1_year_3rd_polio = {first_year:0,second_year:0,third_year:0};

            /** Overall Progress */
            admin.profile.maternal_mortality_progress = 0;
            admin.profile.incidence_of_low_birth_weight_progress = 0;
            admin.profile.neonatal_mortality_progress = 0;
            admin.profile.infant_mortality_rate_progress = 0;
            admin.under5_mortality_rate_progress = 0;
            admin.incidence_of_malaria_laboratory_confirmed_cases_progress = 0;
            admin.HIV_prevalence_in_15_to_24_years_age_group_progress = 0;
            admin.Top_10_cases_of_admission_progress = 0;
            admin.Top_10_causes_of_death_progress = 0;
            admin.OPD_attention_progress = 0;
            admin.Proportion_of_children_under_1_year_vaccinated_against_measles_progress = 0;
            admin.Proportion_of_under_1_year_3rd_polio_progress = 0;

        }
        //
        //
        //admin.uploadCSV = function(){
        //    admin.uploadcsv = true;
        //    admin.editProfileForm = false;
        //    admin.list = false;
        //    admin.addProfileForm = false;
        //    admin.previewcsv = false;
        //}
        //
        admin.uploadProfileToDHIS = function(form){
            $rootScope.failureMessage = null;
            admin.message = null;
            admin.loading = true;
            if(admin.selectedEntryRegion==null){
                $rootScope.failureMessage = 'Form not Submitted!, Select Region';
                admin.loading = false;
                return false;
            }

            if(admin.selectedCSVEntryDistrict==null){
                $rootScope.failureMessage = 'Form not Submitted!, Select District';
                admin.loading = false;
                return false;
            }


            if(admin.csvfile==null){
                $rootScope.failureMessage = 'Form not Submitted!, Choose CSV file';
                admin.loading = false;
                return false;
            }

            if(admin.pdffile==null){
                $rootScope.failureMessage = 'Form not Submitted!, Choose Pdf ReadOnly file';
                admin.loading = false;
                return false;
            }
            admin.loadingUpload = true;
            admin.uploadcsv = true;
            admin.editProfileForm = false;
            admin.list = false;
            admin.addProfileForm = false;
            admin.previewcsv = false;
            $rootScope.failureMessage = null;
                admin.saveProfile(form,admin.pdffile,admin.selectedCSVEntryDistrict);

            form.org_unit_selected = admin.selectedCSVEntryDistrict;

            var dataElementNames = localStorage.getItem('dataElementsNames');//["DHP_Acknowledgements_Acknowledgements_Field", "DHP_DataSourcesCollecctionAnalysisMethods_DataSourcesCollecctionAnalysisMethods", "DHP_Demographics_FacilityDistributionImage", "DHP_Demographics_Female1", "DHP_Demographics_Female2", "DHP_Demographics_Female3", "DHP_Demographics_Female4", "DHP_Demographics_Female5", "DHP_Demographics_Female6", "DHP_Demographics_Male1", "DHP_Demographics_Male2", "DHP_Demographics_Male3", "DHP_Demographics_Male4", "DHP_Demographics_Male5", "DHP_Demographics_Male6", "DHP_Demographics_Year1", "DHP_Demographics_Year2", "DHP_Demographics_Year3", "DHP_Education_Education", "DHP_Executive_Executive_Field", "DHP_FacilityDistribution_FacilityDistribution", "DHP_Foreword_Foreword_Field", "DHP_General_GeneralOPDAttendanceProgress", "DHP_General_GeneralOPDAttendanceTarget", "DHP_General_GeneralOPDAttendanceYear1", "DHP_General_GeneralOPDAttendanceYear2", "DHP_General_GeneralOPDAttendanceYear3", "DHP_Geography_Geography", "DHP_Maternal_MaternalNCHealthInfantMortalityProgress", "DHP_Maternal_MaternalNCHealthInfantMortalityTarget", "DHP_Maternal_MaternalNCHealthLowBWProgress", "DHP_Maternal_MaternalNCHealthLowBWTarget", "DHP_Maternal_MaternalNCHealthLowBWYear1", "DHP_Maternal_MaternalNCHealthLowBWYear2", "DHP_Maternal_MaternalNCHealthLowBWYear3", "DHP_Maternal_MaternalNCHealthNeonatalMortalityProgress", "DHP_Maternal_MaternalNCHealthNeonatalMortalityTarget", "DHP_Maternal_MaternalNCHealthNeonatalMortalityYear1", "DHP_Maternal_MaternalNCHealthNeonatalMortalityYear2", "DHP_Maternal_MaternalNCHealthNeonatalMortalityYear3", "DHP_Maternal_MaternalNCHealthUnder5MortalityTarget", "DHP_Maternal_MaternalNCHealthUnder5MortalityYear1", "DHP_Maternal_MaternalNCHealthUnder5MortalityYear2", "DHP_Maternal_MaternalNCHealthUnder5MortalityYear3", "DHP_Maternal_MaternalNCHealthUnder5MortalityYearProgress", "DHP_MissionAndVision_MissionAndVision", "DHP_Morbidity_MorbidityHIVAIDSTarget", "DHP_Morbidity_MorbidityHIVAIDSYear1", "DHP_Morbidity_MorbidityIncidenceOfMalariaProgress", "DHP_Morbidity_MorbidityIncidenceOfMalariaTarget", "DHP_Morbidity_MorbidityIncidenceOfMalariaYear1", "DHP_Morbidity_MorbidityIncidenceOfMalariaYear2", "DHP_Morbidity_MorbidityIncidenceOfMalariaYear3", "DHP_Morbidity_MorbidityTopTenAdmissionYear1", "DHP_Morbidity_MorbidityTopTenAdmissionYear2", "DHP_Morbidity_MorbidityTopTenAdmissionYear3", "DHP_Morbidity_MortalityTopTenDeathYear2", "DHP_Mortality_MortalityTopTenDeathYear1", "DHP_Mortality_MortalityTopTenDeathYear2", "DHP_Mortality_MortalityTopTenDeathYear3", "DHP_Population_Population", "DHP_Seal_Seal", "DHP_StructureOfDistrict_StructureOfDistrict", "DHP_TransportationAndCommunication_TransportationAndCommunication"];//localStorage.getItem('dataElementsNames');
            var dataElementUids = localStorage.getItem('dataElementsUids');//["FDy14LpsTYe","pJzkVoPSnUZ","ZVxkbmmsVaj","a3KTj2U3qvL","Mb5oqaqrlEO","yEQ4pUa4MiE","khpsCb4CIYO","b3MDBc5qVwA","pimD9Vu6yzP","cO13bJmbwcm","JGUAedwTS7d","VIPWPCH888c","kFUWBguaZH2","W24P1amkarT","NlFp3YFxAVj","qArNNjNQAU3","y2MB317ssba","YsIoPcj149W","dMzcFEjCjEc","vT4W7eesj8V","oqe9RQV64iZ","GIH7HwWycec","xUrTxNMdhwZ","MyAjPcTegFP","waYaK9vNvqv","pPugLQdSVz7","kkp0SNYElja","Dwn3OG3lYcD","IyYYHTT74Qg","rywiKuhcXhi","Pcly4O4zwMP","vYOcXPnPkwG","Fw0Oi3mnCxq","O9JWxhhhpUL","hUDp8nEM9Xu","cHDQiQJRc3q","QeIvaNVBt7L","C0sro0yymAc","i10R7abb5e7","r18DK7WrGqq","ah6hNUZbKGw","rJGgyqtOFqS","wYxHjV46Aam","D0rd3jqvJhj","TgG1AVvdY6N","KvXiDDLbX4E","YOXye8N0kG7","sdBEFTUgED5","oG4bnfukOXH","sbf2nYVcjcz","Z9NTYlGv5xq","FsdeelM8RBt","QfeqQeCDTYp","i6g11NJiXp5","R40i7n5fP73","n7Nol8M8dki","P1WyuyEjfrt","kLSuPxhQZ83","IrjePU1LBSM","BiBYNFnGQF5","wOltvKZerkP","ye0OQ2p6BAK","HCUJj0e2Wbu","c2ff00Brm16"];//localStorage.getItem('dataElementsUids');

            var payload = {file_name:"dataset.csv",file_object:admin.csvfile,orgunit:admin.selectedCSVEntryDistrict,period:form.form_period,names:JSON.stringify(dataElementNames),uids:JSON.stringify(dataElementUids)};
            if(!admin.selectedCSVEntryDistrict&&!form.form_period){

            }else{
                profileService.uploadCSVProfile(payload).then(function(data){
                    console.log(data);
                    admin.showProgress = false;
                    if(data=="UPLOAD_FAILED"){
                        admin.loadingUpload = false;
                        admin.message = "upload failed";
                        admin.message_class = "failed";
                        admin.selectedEntryRegion=null;
                        admin.selectedCSVEntryDistrict=null;
                        admin.csvfile = null;
                        admin.pdffile = null;
                        admin.loading = false;

                    }

                    if(data=="UPLOAD_SUCCESS"){
                        admin.loadingUpload = false;
                        admin.loading = false;
                        //admin.showList();
                        admin.message = "uploaded successful";
                        admin.message_class = "success";
                        utilityService.completeDataset(form.org_unit_selected,form.form_period,function(dataComplete){

                        });
                    }

                    if(data=="FILE_EXIST_ERROR"){
                        admin.loadingUpload = false;
                        admin.loading = false;
                        admin.message = "file exist";
                        admin.message_class = "failed";
                    }

                    if(data=="INVALID_TYPE_ERROR"){
                        admin.loadingUpload = false;
                        admin.loading = false;
                        admin.message = "file is not csv";
                        admin.message_class = "failed";
                    }


                },function(response){});
            }
        }
        //admin.openCriteriaPreview = function(){
        //
        //    if(admin.criteriaPreview){
        //        admin.criteriaPreview = false;
        //    }else{
        //        admin.criteriaPreview = true;
        //    }
        //
        //}
        //admin.readOnlyDataPreview = function(){
        //    admin.uploadcsv = false;
        //    admin.editProfileForm = false;
        //    admin.list = false;
        //    admin.addProfileForm = false;
        //    admin.previewcsv = true;
        //    admin.criteriaPreview = true;
        //    admin.table_data = [];
        //
        //}
        //admin.previewData = function(form){
        //
        //    utilityService.getDataPreview(form).then(function(data){
        //        admin.table_data = utilityService.prepareTabledata(data);
        //        admin.filterProfiles(data);
        //
        //    },function(response){
        //        console.log(data);
        //    });
        //}
        //
        //
        utilityService.loadOrganisationUnits().then(function(data){
            admin.regions = utilityService.modifyOrgUnits(data.organisationUnits[0].children);
        });
        //
        $scope.$watch("admin.selectedOrgUnitList",function(newValue,oldValue){
            if(newValue){
                var OrgUnit = newValue.split("_");
                admin.selectedOrgUnitToDisplay = OrgUnit[1];
            }
        });

        $scope.$watch("admin.periodCriteria",function(newValue,oldValue){
            admin.selectedPeriod = newValue;
        });

        function getDirstrictName(sample_name){
            var broken_name = sample_name.split(" -> ");

            return broken_name[1];
        }

        admin.periods = utilityService.getPeriods(2010);
        /**
        *  THE END
        * */
    }
})()


