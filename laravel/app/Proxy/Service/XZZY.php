<?php

namespace App\Proxy\Service;

class XZZY extends \App\Proxy\Service\AbstractService implements \App\Proxy\Service\ServiceInterface
{
    protected $source = 'xzzy';

    public function process()
    {
        $url = $this->config['url'];
        $page = $this->downloadPage($url);
        $links = explode("\n", $page);
        foreach($links as $key => $l) {
            $page2 = $this->downloadPage($l);
            $addresses = $this->fetchAddresses($page2);
            $this->addServers($addresses);
            echo PHP_EOL . $key . PHP_EOL;
        }
    }
}