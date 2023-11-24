<?php

class Autoloader
{
	public static function register ()
    {
		spl_autoload_register(
			function ($class) {
				foreach (AUTOLOAD_DIRECTORIES as $dir) {
				    $classPath = ROOT_DIR . $dir . $class . '.php';

                    if (file_exists($classPath)) {
                        require_once $classPath;
                        return true;
                    }
                }
				
				return false;
			}
		);
	}
}