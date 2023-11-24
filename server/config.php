<?php

define('DS', DIRECTORY_SEPARATOR);
define('ROOT_DIR', __DIR__ . DS);
define('SYSTEM_DIR', ROOT_DIR . 'system' . DS);
define('SYSTEM_CLASSES', SYSTEM_DIR . 'classes' . DS);

define('AUTOLOAD_DIRECTORIES', [
    'application/controller/',
    'application/model/',
    'application/service/',
    'system/classes/'
]);

define('DB_HOST', 'localhost');
define('DB_DATABASE', '_test_beejee');
define('DB_USERNAME', 'root');
define('DB_PASSWORD', 'root');

define('TOKEN_SECRET', 'secret');
define('TOKEN_EXPIRED_TIME', 3600);

define('HASHED_PASSWORD_COST', 12);
define('SALT', 'Hello');