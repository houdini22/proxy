<?php

namespace App\Proxy\Service;

class ProxyDB extends \App\Proxy\Service\AbstractService implements \App\Proxy\Service\ServiceInterface
{
    protected $source = 'proxydb.net';

    public function process()
    {
        $url = $this->config['url'];

        do {
            $page = $this->downloadPage($url);
            $phpquery = $this->createPhpQuery($page);
            $addresses = $this->fetchAddresses($page);
            $this->addServers($addresses);
            $btn = $phpquery->find('form.mb-3 a.btn:last');
            $btn = pq($btn);

            $url = 'https://proxydb.net' . $btn->attr('href');
        } while ($btn->size());
    }
}