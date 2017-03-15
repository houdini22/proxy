<?php

namespace App\Proxy\Service;

class ProxyDB extends \App\Proxy\Service\AbstractService implements \App\Proxy\Service\ServiceInterface
{
    protected $source = 'proxydb.net';

    public function process()
    {
        $url = $this->config['url'];
        $start = 0;
        $end = 10000 / 50;

        for($i = 0; $i <= $end; $i += 50) {
            $page = $this->downloadPage($url);
            $phpquery = $this->createPhpQuery($page);
            $addresses = $this->fetchAddresses($page);
            $this->addServers($addresses);
            $btn = $phpquery->find('form.mb-3 a.btn:last');
            $btn = pq($btn);

            $url = 'https://proxydb.net/?offset=' . $i;
        }
    }
}