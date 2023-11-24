<?php

class View
{
	private static function json ($result, $data, $log = '')
    {
        if (!is_array($data)) {
            $data = ['data' => $data];
        }

        echo json_encode(array_merge(['result' => $result], $data, ['log' => $log]));
        die();
    }

    public static function error ($log, $data = [])
    {
        self::json(false, $data, $log);
    }

    public static function success ($data)
    {
        self::json(true, $data);
    }
}