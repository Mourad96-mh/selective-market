<?php
$xml = @file_get_contents('https://selective-market-api.onrender.com/sitemap.xml');
if ($xml === false) {
    http_response_code(503);
    exit('Sitemap unavailable');
}
header('Content-Type: application/xml; charset=UTF-8');
header('Cache-Control: public, max-age=3600');
echo $xml;
