<?php


class UserController extends Controller
{
    private UserModel $userModel;

    function __construct ()
    {
        parent::__construct();
        $this->userModel = new UserModel();
    }

    public function GetUsers ()
    {
        View::success(['users' => $this->userModel->getUsers()]);
    }
}