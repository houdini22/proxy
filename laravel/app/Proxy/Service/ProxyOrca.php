<?php

namespace Apa\Proxy\Service;

use App\Proxy\Service\ServiceInterface;

class ProxyOrca extends AbstractService implements ServiceInterface {
    public function process($link = NULL)
    {
        $page = $this->downloadPage($link);
        $pageQuery = \phpQuery::newDocument($page);
        foreach ($pageQuery->find("a") as $link)
        {
            $page2 = $this->downloadPage(pq($link)->attr("href"));
            \App\Proxy\Proxy::addServers($this->fetchAddresses($page2), 'ProxyOrca');
        }
    }
}