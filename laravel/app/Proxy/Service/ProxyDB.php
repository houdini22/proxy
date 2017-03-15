<?php

namespace App\Proxy\Service;

class ProxyDB extends \App\Proxy\Service\AbstractService implements \App\Proxy\Service\ServiceInterface
{
    protected $source = 'proxydb.net';

    public function process()
    {
        $url = $this->config['url'];

        for($i = 0; $i <= 400000; $i += 50) {
            $page = $this->downloadPage($url);
            $addresses = $this->fetchAddresses($page);
            $this->addServers($addresses);
            $url = 'https://proxydb.net/?offset=' . $i;
        }
    }
}