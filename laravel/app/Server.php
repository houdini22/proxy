<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Server extends Model
{
    protected $table = 'servers';

    public function getIp()
    {
        list($ip,) = explode(':', $this->address);
        return $ip;
    }

    public function getPort()
    {
        list(, $port) = explode(':', $this->address);
        return $port;
    }

    public function save(array $options = array())
    {
        return parent::save($options);
    }
}
