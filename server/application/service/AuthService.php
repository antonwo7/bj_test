<?php


class AuthService
{
    public static function hashPassword ($password)
    {
        return md5($password);
    }
}