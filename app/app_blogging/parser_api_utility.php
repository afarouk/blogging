<?php

function url_origin($s, $use_forwarded_host = false)
{
    $ssl      = (!empty($s['HTTPS']) && $s['HTTPS'] == 'on') ? true : false;
    $sp       = strtolower($s['SERVER_PROTOCOL']);
    $protocol = substr($sp, 0, strpos($sp, '/')) . (($ssl) ? 's' : '');
    $port     = $s['SERVER_PORT'];
    $port     = ((!$ssl && $port == '80') || ($ssl && $port == '443')) ? '' : ':' . $port;
    $host     = ($use_forwarded_host && isset($s['HTTP_X_FORWARDED_HOST'])) ? $s['HTTP_X_FORWARDED_HOST'] : (isset($s['HTTP_HOST']) ? $s['HTTP_HOST'] : null);
    $host     = isset($host) ? $host : $s['SERVER_NAME'] . $port;
    return $protocol . '://' . $host;
}

function full_url($s, $use_forwarded_host = false)
{
    return url_origin($s, $use_forwarded_host) . $s['REQUEST_URI'];
}

function php_log($param)
{
    $file = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'php_console.log';
    //$file = 'php_console.log';
    
    // Write the contents to the file, 
    // using the FILE_APPEND flag to append the content to the end of the file
    // and the LOCK_EX flag to prevent anyone else writing to the file at the same time
    file_put_contents($file, $param . PHP_EOL, FILE_APPEND);
}


// validateParams function is responsible for validate and snitation of query parameter/query string 
//@param(string) is the key or name of variable used in url query string either post or get method
function validateParams($param)
{
    if (isset($_REQUEST[$param])) {
        //echo $param . ' was set in the query string <BR>';
        // param was set in the query string
        if (empty($_REQUEST[$param])) {
            //echo 'but ' . $param . ' was empty <BR>';
            // query string had param set to nothing ie ?param=&param2=something
            return FALSE;
        } else {
            //echo 'and ' . $param . ' was non empty <BR>';
            return TRUE;
        }
    } else {
        // param was set NOT in the query string
        //echo $param . ' was not even set <BR>';
        return FALSE;
    }
}


function booleanToString($bool){
    if (is_bool($bool) === true) {
        if($bool == true){ 
            return "true";  
        } else { 
            return "false";
        } 
    } else { 
        return NULL;
    }
}


// parameters - just complete http request including query string
function makeApiCall($urlToCall)
{
    
    //
    $ch = curl_init();
    
    //timeout after 10 seconds, you can increase it
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
    
    //Set curl to return the data instead of printing it to the browser.
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, false);
    
    // Some server may refuse your request if you dont pass user agent
    curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1)");
    
    //not verifying ssl
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    //set the url, number of POST vars, POST data
    
    
    curl_setopt($ch, CURLOPT_URL, $urlToCall);
    
    $curl_output = curl_exec($ch);
    if (curl_errno($ch)) {
        $data['curl_error'] = curl_error($ch);
        
        
    } else {
        $data               = json_decode($curl_output, true);
        $data['curl_error'] = false;
    }
    
    return $data;
    
}

?> 