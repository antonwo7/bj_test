<?php

function getRouterPath ()
{
    return preg_replace('/ ^\/? (.+) \/?$ /xsi', '$1', parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH));
}

function convertToCamel ($value)
{
    return str_replace('_', '', ucwords($value, '_'));
}

function base64UrlEncode ($data)
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}