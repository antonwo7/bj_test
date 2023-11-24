<?php

class Controller
{
    public Request $request;

    function __construct ()
    {
        $this->request = new Request();
    }

    protected function CheckAuthorization ()
    {
        $token = $this->request->header()->token();

        $authUserId = TokenService::validateToken($token);
        if (!$authUserId) {
            View::error('Token is invalid');
        }

        return $authUserId;
    }
}