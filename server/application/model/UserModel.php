<?php

class UserModel extends Model
{
    public function login ($username, $password)
    {

        $query = <<<SQL
            SELECT 
                u.id, u.username, u.name, u.is_admin
            FROM 
                users u
            WHERE 
                u.username = :username AND u.password = :password AND u.is_admin = 1
SQL;

        $st = $this->db->prepare($query);
        $st->bindParam(':username', $username, PDO::PARAM_STR);
        $st->bindParam(':password', $password, PDO::PARAM_STR);
        $result = $st->execute();
        if (!$result) return null;

        $user = $st->fetchObject();

        return $user ? $user : null;
    }

    public function getUserById ($id)
    {
        $query = <<<SQL
            SELECT 
                u.id, u.username, u.name, u.is_admin
            FROM 
                users u
            WHERE 
                u.id = :id
SQL;

        $st = $this->db->prepare($query);
        $st->bindParam(':id', $id, PDO::PARAM_INT);
        $result = $st->execute();
        if (!$result) return null;

        $user = $st->fetchObject();

        return $user ? $user : null;
    }

    public function getUsers ()
    {
        $query = <<<SQL
            SELECT 
                u.id, u.username, u.name, u.is_admin
            FROM 
                users u
SQL;

        $result = $this->db->query($query);
        if (!$result) return null;

        $users = $result->fetchAll(PDO::FETCH_ASSOC);

        return $users ? $users : [];
    }
}