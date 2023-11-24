<?php


class TaskController extends Controller
{
    private TaskModel $taskModel;

    function __construct ()
    {
        parent::__construct();
        $this->taskModel = new TaskModel();
    }

    public function GetTasks ()
    {
        $tasksData = $this->request->get();

        $sortBy = !empty($tasksData['sort_by']) && in_array($tasksData['sort_by'], ['id', 'username', 'email', 'is_done', 'is_edited'])
            ? $tasksData['sort_by']
            : 'id';
        $sortOrder = !empty($tasksData['sort_order']) && in_array($tasksData['sort_order'], ['desc', 'asc'])
            ? $tasksData['sort_order']
            : 'desc';
        $limit = !empty($tasksData['limit']) && filter_var($tasksData['limit'], FILTER_VALIDATE_INT)
            ? intval($tasksData['limit'])
            : 10;
        $offset = !empty($tasksData['page']) && filter_var($tasksData['page'], FILTER_VALIDATE_INT)
            ? (intval($tasksData['page']) - 1) * $limit : 0;

        $result = $this->taskModel->getTasks($limit, $offset, $sortBy, $sortOrder);
        if ($result === null || !isset($result['tasks']) || !isset($result['count'])) {
            View::error('Task list error');
        }

        $tasks = array_map(function($task) {
            $task['id'] = intval($task['id']);
            $task['is_done'] = intval($task['is_done']);
            $task['is_edited'] = intval($task['is_edited']);
            return $task;
        }, $result['tasks']);

        View::success(['tasks' => $tasks, 'count' => $result['count']]);
    }

    public function UpdateTask ()
    {
        $this->CheckAuthorization();

        $taskData = $this->request->post();

        $errors = [];

        if (empty($taskData['id']))
            $errors[] = 'Field id is not valid';
        if (empty($taskData['text']))
            $errors[] = 'Field text is not valid';
        if (empty($taskData['email']) || !filter_var($taskData['email'], FILTER_VALIDATE_EMAIL))
            $errors[] = 'Field email is not valid';
        if (empty($taskData['user_id']) || !filter_var($taskData['user_id'], FILTER_VALIDATE_INT))
            $errors[] = 'Field user_id is not valid';
        if (!isset($taskData['is_edited']) || !in_array($taskData['is_edited'], [0, 1]))
            $errors[] = 'Field is_edited is not valid';
        if (!isset($taskData['is_done']) || !in_array($taskData['is_done'], [0, 1]))
            $errors[] = 'Field is_done is not valid';

        if (!empty($errors)) {
            View::error($errors);
        }

        $filteredTaskData = [];

        $filteredTaskData['text'] = filter_var($taskData['text'], FILTER_SANITIZE_STRING);
        $filteredTaskData['email'] = filter_var($taskData['email'], FILTER_SANITIZE_STRING);
        $filteredTaskData['user_id'] = filter_var($taskData['user_id'], FILTER_SANITIZE_NUMBER_INT);
        $filteredTaskData['is_edited'] = $taskData['is_edited'];
        $filteredTaskData['is_done'] = $taskData['is_done'];

        $task_id = filter_var($taskData['id'], FILTER_SANITIZE_NUMBER_INT);

        $result = $this->taskModel->updateTask($task_id, $filteredTaskData);
        if (!$result) {
            View::error('Task update error');
        }

        View::success([]);
    }

    public function AddTask ()
    {
        $this->CheckAuthorization();

        $taskData = $this->request->post();

        $errors = [];

        if (empty($taskData['text']))
            $errors[] = 'Field text is not valid';
        if (empty($taskData['email']) || !filter_var($taskData['email'], FILTER_VALIDATE_EMAIL))
            $errors[] = 'Field email is not valid';
        if (empty($taskData['user_id']) || !filter_var($taskData['user_id'], FILTER_VALIDATE_INT))
            $errors[] = 'Field user_id is not valid';

        if (!empty($errors)) {
            View::error($errors);
        }

        $filteredTaskData = [];

        $filteredTaskData['text'] = filter_var($taskData['text'], FILTER_SANITIZE_STRING);
        $filteredTaskData['email'] = filter_var($taskData['email'], FILTER_SANITIZE_STRING);
        $filteredTaskData['user_id'] = filter_var($taskData['user_id'], FILTER_SANITIZE_NUMBER_INT);

        $result = $this->taskModel->addTask($filteredTaskData);
        if (!$result) {
            View::error('Task addition error');
        }

        View::success([]);
    }

    public function DeleteTask ()
    {
        $this->CheckAuthorization();

        $data = $this->request->post();
        if (empty($data['id']) || !filter_var($data['id'], FILTER_VALIDATE_INT)) {
            View::error('Task id is not valid');
        }

        $taskId = filter_var($data['id'], FILTER_SANITIZE_NUMBER_INT);

        $result = $this->taskModel->deleteTask($taskId);
        if (!$result) {
            View::error('Task deletion error');
        }

        View::success([]);
    }
}