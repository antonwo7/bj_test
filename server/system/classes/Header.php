<?php


class Header
{
    private ?string $bearerToken;

    function __construct ()
    {
        $this->bearerToken = $this->getBearerToken();
    }

    private function getAuthorizationHeader ()
    {
        $authorizationHeader = null;

        if (isset($_SERVER['Authorization'])) {
            $authorizationHeader = trim($_SERVER["Authorization"]);

        } else if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $authorizationHeader = trim($_SERVER["HTTP_AUTHORIZATION"]);

        } else if (function_exists('apache_request_headers')) {
            $requestHeaders = apache_request_headers();
            $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));

            if (isset($requestHeaders['Authorization'])) {
                $authorizationHeader = trim($requestHeaders['Authorization']);
            }
        }

        return $authorizationHeader;
    }

    private function getBearerToken ()
    {
        $authorizationHeader = $this->getAuthorizationHeader();

        if (!empty($authorizationHeader)) {
            if (preg_match('/Bearer\s(\S+)/', $authorizationHeader, $matches)) {
                return $matches[1];
            }
        }

        return null;
    }

    public function token ()
    {
        return $this->bearerToken;
    }
}