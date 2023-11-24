<?php

class Database
{
    private $db;
	
	function __construct ($host, $database, $username, $password)
    {
        try {
            @$this->db = new PDO("mysql:host={$host};dbname={$database}", $username, $password);
        } catch (Exception $e) {
            $this->db = null;
        }
	}

	public function getDB ()
    {
        return $this->db;
    }
}