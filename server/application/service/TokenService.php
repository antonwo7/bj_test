<?php


class TokenService
{
    public static function generateToken ($payload)
    {
        $headersEncoded = base64UrlEncode(json_encode([ 'alg' => 'HS256', 'typ' => 'JWT' ]));
        $payloadEncoded = base64UrlEncode(json_encode($payload));
        $signature = hash_hmac('SHA256', "$headersEncoded.$payloadEncoded", TOKEN_SECRET, true);
        $signatureEncoded = base64UrlEncode($signature);

        return "$headersEncoded.$payloadEncoded.$signatureEncoded";
    }

    public static function validateToken ($token)
    {
        $tokenParts = explode('.', $token);
        $header = base64_decode($tokenParts[0]);
        $payload = base64_decode($tokenParts[1]);
        $signatureProvided = $tokenParts[2];
        $payloadDecoded = json_decode($payload);
        $tokenExpiration = $payloadDecoded->exp;
        $tokenUserId = $payloadDecoded->id;

        $isTokenExpired = ($tokenExpiration - time()) < 0;
        if ($isTokenExpired) return false;

        $base64UrlHeader = base64UrlEncode($header);
        $base64UrlPayload = base64UrlEncode($payload);
        $signature = hash_hmac('SHA256', $base64UrlHeader . "." . $base64UrlPayload, TOKEN_SECRET, true);
        $base64UrlSignature = base64UrlEncode($signature);

        return ($base64UrlSignature === $signatureProvided) ? $tokenUserId : false;
    }
}