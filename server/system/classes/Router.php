<?php

class Router
{
	
	public function __construct ()
    {
		$controllerName = '';
		$actionName = '';

		$routeParts = explode('/', getRouterPath());

		if (!empty($routeParts[count($routeParts) - 2])) {
            $controllerName = convertToCamel($routeParts[count($routeParts) - 2]) . 'Controller';
        }
		
		if (!empty($routeParts[count($routeParts) - 1])) {
            $actionName = convertToCamel($routeParts[count($routeParts) - 1]);
        }

		if (!class_exists($controllerName)) {
		    die('Class doesnt exist');
        }

		$controller = new $controllerName();
		
		if (!method_exists($controller, $actionName)) {
            die('Method doesnt exist');
		}

        $controller->$actionName();
	}

}