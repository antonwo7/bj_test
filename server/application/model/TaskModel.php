<?php


class TaskModel extends Model
{
    public function getTasks ($limit = 10, $offset = 0, $sortBy = 'id', $sortOrder = 'desc')
    {
        $query = "
            SELECT
                SQL_CALC_FOUND_ROWS
                tasks.*,
                users.id as user_id, 
                users.name as user_name
            FROM 
                tasks
            LEFT JOIN
                users ON users.id = tasks.user_id
            ORDER BY {$sortBy} {$sortOrder}
            LIMIT {$limit} OFFSET {$offset}";

        $st = $this->db->prepare($query);
        $result = $st->execute();
        if (!$result) return null;

        $tasks = $st->fetchAll(PDO::FETCH_ASSOC);

        $query = "SELECT FOUND_ROWS() AS count";
        $result = $this->db->query($query);
        $countObject = $result->fetchObject();
        if (!$countObject) return null;

        $count = $countObject->count;

        return [
            'tasks' => $tasks,
            'count' => $count
        ];
    }

    public function updateTask ($id, $data)
    {
        $query = <<<SQL
            UPDATE tasks
            SET email = :email, text = :text, is_done = :isDone, is_edited = :isEdited, user_id = :userId
            WHERE id = :id;
SQL;

        $st = $this->db->prepare($query);
        $st->bindParam(':id', $id, PDO::PARAM_INT);
        $st->bindParam(':email', $data['email'], PDO::PARAM_STR);
        $st->bindParam(':text', $data['text'], PDO::PARAM_STR);
        $st->bindParam(':isDone', $data['is_done'], PDO::PARAM_INT);
        $st->bindParam(':isEdited', $data['is_edited'], PDO::PARAM_INT);
        $st->bindParam(':userId', $data['user_id'], PDO::PARAM_INT);
        $result = $st->execute();
        return (bool)$result;
    }

    public function addTask ($data)
    {
        $query = <<<SQL
            INSERT 
                INTO tasks(text, email, user_id) 
            VALUES
                (:text, :email, :userid);
SQL;

        $st = $this->db->prepare($query);
        $st->bindParam(':text', $data['text'], PDO::PARAM_STR);
        $st->bindParam(':email', $data['email'], PDO::PARAM_STR);
        $st->bindParam(':userid', $data['user_id'], PDO::PARAM_INT);
        $result = $st->execute();
        return (bool)$result;
    }

    public function deleteTask ($id)
    {
        $query = <<<SQL
            DELETE FROM 
                tasks 
            WHERE
                tasks.id = :id
SQL;

        $st = $this->db->prepare($query);
        $st->bindParam(':id', $id, PDO::PARAM_INT);
        $result = $st->execute();
        return (bool)$result;
    }
}