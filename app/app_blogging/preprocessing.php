<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
include_once ('parser_api_utility.php');

$completeURL = full_url($_SERVER, true);
$serverName = $_SERVER['SERVER_NAME'];

/*is demo=true */
if (validateParams('demo')) {
$demo = TRUE;
} else {
$demo = FALSE;
}

/*is demo=true */
if (validateParams('embedded')) {
$embedded= TRUE;
} else {
$embedded = FALSE;
}

/* is API server specified? */
if (validateParams('server')) {
  $server = $_REQUEST['server'];
   if (strcmp($server, 'localhost') === 0)
    $server = $server . ':8080';
   } else {
  if ($demo) {
   $server = "simfel.com";
  } else {
   $server = "communitylive.co";
  }
}

/* determine the api protocol */
if (strpos($server, 'localhost') !== false) {
  $protocol = 'http://';
}  else {
  $protocol = 'https://';
}

/* is serviceAccomodatorId specified (only from Portal) */
if (validateParams('serviceAccommodatorId')) {
 $serviceAccommodatorId = $_REQUEST['serviceAccommodatorId'];
} else {
 $serviceAccommodatorId = NULL;
}

if (validateParams('serviceLocationId')) {
 $serviceLocationId = $_REQUEST['serviceLocationId'];
} else {
 $serviceLocationId = NULL;
}


if (validateParams('UID')) {
$UID = $_REQUEST['UID'];
} else {
$UID = NULL;
}

if (validateParams('t')) {
$type = $_REQUEST['t'];
} else {
$type = NULL;
}

if (validateParams('u')) {
$uuidURL = $_REQUEST['u'];
} else {
$uuidURL = NULL;
}

if (validateParams('shareId')) {
  $shareId = $_REQUEST['shareId'];
} else {
  $shareId = NULL;
}

if($type==='l'){
  $sharedblogging=TRUE;
}else {
  $sharedblogging=FALSE;
}
/* NOTE: if debug=true then PHP will echo variables and exit */
if (validateParams('debug')) {
$debug = TRUE;
} else {
$debug = FALSE;
}

$errorMessage = NULL;
$appleTouchIcon60URL = NULL;
$isPrivate = FALSE;
$canCreateAnonymousUser = FALSE;
$apiURL = $protocol . $server . "/apptsvc/rest/blogging/retrieveSitelette?UID=&latitude=&longitude=";

$siteletteJSON = makeApiCall($apiURL);
if ($siteletteJSON['curl_error']) {
 $errorMessage = $siteletteJSON['curl_error'];
 $errorMessage = 'Service unavailable.';
} else {
 if (isset($siteletteJSON['error'])) {
  $errorMessage = $siteletteJSON['error']['message'];
 } else {
  $saslJSON = json_decode($siteletteJSON['saslJSON'], TRUE);
  $serviceAccommodatorId = $saslJSON['serviceAccommodatorId'];
  $serviceLocationId = $saslJSON['serviceLocationId'];
  $themeCSS = 'styles.css';
  /* Facebook specific: sharing related meta data */
  //$og_url=$completeURL;
  $og_type="article";
  $og_title="Where Great Minds Don't Think Alike";
  $og_description="Test your knowledge. Share with friends. Learn while having fun.";
  $og_image=$protocol.$server."/apptsvc/rest/media/retrieveStaticMedia/blogging/default.jpg";
  /* Twitter related */
  $twitter_card="summary_large_image";
  $twitter_site="@blogging";
  $twitter_title="Where Great Minds Don't Think Alike";
  $twitter_description="Test your knowledge. Share with friends. Learn while having fun.";
  $twitter_image=$protocol.$server."/apptsvc/rest/media/retrieveStaticMedia/blogging/default.jpg";

  if( $sharedblogging ){
    /* pull up the question and prepare the meta data */

    $apiURL = $protocol . $server . "/apptsvc/rest/blogging/retrieveQuestion?contestUUID=".$uuidURL;
    $questionJSON = makeApiCall($apiURL);
    if ($questionJSON['curl_error']) {
     $errorMessage = $siteletteJSON['curl_error'];
     $errorMessage = 'Service unavailable.';
    } else if (isset($questionJSON['error'])) {
      $errorMessage = $questionJSON['error']['message'];
    } else {
      /* change meta data based on question */

      $og_title=$questionJSON['ogTitle'];
      $og_description=$questionJSON['ogDescription'];
      $og_image =$questionJSON['ogImage'];

      $twitter_title=$questionJSON['ogTitle'];
      $twitter_description=$questionJSON['ogDescription'];
      $twitter_image=$questionJSON['ogImage'];
    }
  }
 }
}

if ($debug) {
 echo '$completeURL=' . $completeURL . "</br>";
 echo '$serverName=' . $serverName . "</br>";
 echo '$server=' . $server . "</br>";
 echo '$embedded=' . ($embedded ? 'true' : 'false') . "</br>";
 echo '$demo=' . ($demo ? 'true' : 'false') . "</br>";
 echo '$UID=' . $UID . "</br>";
 echo '$apiURL='.$apiURL."</br>";
 echo '$type='.$type."</br>";
 echo '$uuidURL='.$uuidURL."</br>";
 echo '$sharedblogging='.$sharedblogging."</br>";
 echo '$shareId='.$shareId.'</br>';
 if($errorMessage){
   echo '$errorMessage='.$errorMessage.'</br>';
 }else{
   echo '$og_type='.$og_type.'</br>';
   echo '$og_title='.$og_title.'</br>';
   echo '$og_description='.$og_description.'</br>';
   echo '$og_image='.$og_image.'</br>';
 }
 exit("End of debug output");
}

?>
