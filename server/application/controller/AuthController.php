<?php


class AuthController extends Controller
{
    private UserModel $userModel;

    function __construct ()
    {
        parent::__construct();
        $this->userModel = new UserModel();
    }

    public function Login ()
    {
        $errors = [];

        $loginData = $this->request->post();

        $username = filter_var($loginData['username'], FILTER_SANITIZE_STRING);
        if (empty($loginData['username'])) $errors[] = 'Username is not valid';

        $password = filter_var($loginData['password'], FILTER_SANITIZE_STRING);
        if (empty($loginData['password'])) $errors[] = 'Password is not valid';

        if (!empty($errors)) {
            View::error($errors);
        }

        $password = AuthService::hashPassword($password);

        $user = $this->userModel->login($username, $password);

        if (!$user) {
            View::error('Username or password incorrect');
        }

        $token = TokenService::generateToken(['id' => $user->id, 'exp' => (time() + TOKEN_EXPIRED_TIME)]);

        View::success(['token' => $token, 'user' => $user]);
    }

    public function Validate ()
    {
        $authUserId = $this->CheckAuthorization();
        if (!filter_var($authUserId, FILTER_VALIDATE_INT)) {
            View::error('Token error');
        }

        $user = $this->userModel->getUserById($authUserId);
        if (!$user) {
            View::error('Authorization error');
        }

        View::success(['user' => $user]);
    }
}