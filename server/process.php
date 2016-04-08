<?php
include_once('functions.php');
//$filePath = "/usr/share/nginx/html/dhpportal/";
$filePath = "home/dhis/tomcat-main/ROOT/webapps/dhpportal/";
// Check if  file variable
if(isset($_GET["file"])) { $test_variable = "for upload";
	$target_file = $_GET['new_file_name'];

	$target_dir = $filePath."uploads/";
	$target_file = $target_dir . basename($target_file);
	$uploadOk = 1;
	$fileType = pathinfo($target_file,PATHINFO_EXTENSION);
  if (file_exists($target_file)) {

      echo "FILE_EXIST_ERROR";

    $uploadOk = 0;
  }else{
			
	if($fileType != "pdf") {
		echo "INVALID_TYPE_ERROR";
		$uploadOk = 0;
		}else{
		if($dhp::uploadFile($_FILES["file"]["tmp_name"],$target_file)){
            echo "UPLOAD_SUCCESS";
		   }else{
           echo "UPLOAD_FAILED";
        }

		}
			
			
  }

}


if(isset($_GET["csv_input"])){
    $categoryOptionCombo     = "uGIJ6IdkP7Q";
    $attributeOptionCombo    = "uGIJ6IdkP7Q";
    $test_variable           = "for upload";
    $names                   = $_POST['dataElementsNames'];
    $uids                    = $_POST['dataElementsUid'];
    $target_file             = $_GET['new_file_name'];
    $period = $_POST['period'];
    $orgUnitId = $_POST['orgUnitId'];

    // changing
    $decodedNames            = html_entity_decode($names);
    $decodedUids             = html_entity_decode($uids);
    $namesArray              = json_decode($decodedNames, true);
    $uidsArray               = json_decode($decodedUids, true);

//    $target_dir              = "dataset/";
    $target_dir              = $filePath."dataset/";
    $target_file             = $target_dir . basename($target_file);
    $uploadOk                = 1;
    $fileType                = pathinfo($target_file,PATHINFO_EXTENSION);

    if (file_exists($target_file)) {
        if(unlink($target_file)){
            if($dhp::uploadFile($_FILES["file"]["tmp_name"],$target_file)){

                echo $output = $dhp::processUploadsForDHIS($target_file,$period,$orgUnitId,$categoryOptionCombo,$attributeOptionCombo,$namesArray,$uidsArray);

            }else{
                echo "UPLOAD_FAILED";
            }
        }



        $uploadOk = 0;
    }else{

        if($fileType != "csv") {
            echo "INVALID_TYPE_ERROR";
            $uploadOk = 0;
        }else{

            if($dhp::uploadFile($_FILES["file"]["tmp_name"],$target_file)){
                $dhp::processUploadsForDHIS($target_file,$period,$orgUnitId,$categoryOptionCombo,$attributeOptionCombo,$namesArray,$uidsArray);
            }else{
                echo "UPLOAD_FAILED";
            }

        }

    }

}

if(isset($_GET["list_files"])){
    $file_list = $dhp->getAppropiatePdfFiles();
    echo json_encode($file_list);

}


if(isset($_GET["by_year"])&&isset($_GET["by_orgunit"])){
    $file_list = $dhp->getAppropiatePdfFiles();
    array_shift($file_list);
    array_shift($file_list);
    $available_files = array();
    foreach($file_list as $index=>$value){
        $orgUnit_array = explode("_",$value);
        if(is_array($orgUnit_array)){
            $orgUnit_array_year = explode(".",$orgUnit_array[2]);
            if($_GET["by_year"]==$orgUnit_array_year[0]&&($orgUnit_array[0]==$_GET["by_orgunit"]||$orgUnit_array[1]==$_GET["by_orgunit"])){
                array_push($available_files,$value);
            }
        }

    }
    echo json_encode($available_files);

}

if(isset($_GET['only'])&&isset($_GET["by_year"])){
    $file_list_by_year = $dhp->getAppropiatePdfFiles();
    array_shift($file_list_by_year);
    array_shift($file_list_by_year);
    $available_files = array();
    foreach($file_list_by_year as $index=>$value){
        $orgUnit_array = explode("_",$value);
        if(is_array($orgUnit_array)){
            $orgUnit_array_year = explode(".",$orgUnit_array[2]);
            if($_GET["by_year"]==$orgUnit_array_year[0]){
                array_push($available_files,$value);
            }
        }

    }
    echo json_encode($available_files);

}

if(isset($_GET['only'])&&isset($_GET["by_orgunit"])){
    $file_list = $dhp->getAppropiatePdfFiles();
    echo json_encode($file_list);

}


if(isset($_GET["delete"])){
    if($dhp->deleteFile($_GET["delete"])){
        echo "DELETE SUCCESS";
    }else{
        echo "DELETE FAILURE";
    }
}

if(isset($_GET["list_files"])&&isset($_GET["orgunit"])&&isset($_GET["year"])){
   $file_list_by_year = $dhp->getAppropiatePdfFiles();
    array_shift($file_list_by_year);
    array_shift($file_list_by_year);
    $available_files = array();
    foreach($file_list_by_year as $index=>$value){
        $orgUnit_array = explode("_",$value);
        if(is_array($orgUnit_array)){
            $orgUnit_array_year = explode(".",$orgUnit_array[2]);
            if($_GET["by_year"]==$orgUnit_array_year[0]){
                array_push($available_files,$value);
            }
        }

    }
    echo json_encode($available_files);

}


?>
