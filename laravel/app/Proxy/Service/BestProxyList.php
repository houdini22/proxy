<?php

namespace App\Proxy\Service;

class BestProxyList extends \App\Proxy\Service\AbstractService implements \App\Proxy\Service\ServiceInterface {
	protected $source = 'BestProxyList';
	public function process()
	{
		$page = $this->downloadPage($this->config['url']);
		$addresses = $this->fetchAddresses($page);
		$this->addServers($addresses);
		$phpquery = $this->createPhpQuery($page);

		while($phpquery->find(".blog-pager-older-link")->size())
		{
			$links = $phpquery->find("h3.post-title a");
			foreach ($links as $link)
			{
				$url = pq($link)->attr("href");
				$page = $this->downloadPage($url);
				$addresses = $this->fetchAddresses($page);
				$this->addServers($addresses);
			}

			$url = $phpquery->find(".blog-pager-older-link")->attr("href");
			$page = $this->downloadPage($url);
			$phpquery = $this->createPhpQuery($page);
		}
	}
}