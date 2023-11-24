<?php


class Request
{
    private array $get;
    private array $post;

    private Header $header;

    function __construct ()
    {
        $this->get = $_GET;
        $this->post = $_POST;
        $this->header = new Header();
    }

    public function get ()
    {
        return $this->get;
    }

    public function post ()
    {
        return $this->post;
    }

    public function header ()
    {
        return $this->header;
    }


}