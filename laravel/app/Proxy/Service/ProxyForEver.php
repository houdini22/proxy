<?php

namespace App\Proxy\Service;

class ProxyForEver extends \App\Proxy\Service\AbstractService implements \App\Proxy\Service\ServiceInterface {
	protected $source = 'Proxy4Ever';
	public function process()
	{
		$page = $this->downloadPage($this->config['url']);
		$addresses = $this->fetchAddresses($page);
		$this->addServers($addresses);
		$phpquery = $this->createPhpQuery($page);
        $i = 0;
		while($phpquery->find(".next.page-numbers")->size())
		{
			$link = $phpquery->find(".next.page-numbers")->attr('href');
			$page = $this->downloadPage($link);
            $addresses = $this->fetchAddresses($page);
            $this->addServers($addresses);
            $phpquery = $this->createPhpQuery($page);
            echo PHP_EOL . $i . PHP_EOL;
            $i++;
		}
	}
}