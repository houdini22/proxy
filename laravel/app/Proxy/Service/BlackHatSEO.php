<?php

namespace App\Proxy\Service;

class BlackHatSEO extends \App\Proxy\Service\AbstractService implements \App\Proxy\Service\ServiceInterface
{
    protected $source = 'BlackHatSEO';

    public function process()
    {
        $pageUrls = [];
        $pageUrls[] = $this->config['url'];
        for ($i = 2; $i < 3; $i++) {
            $pageUrls[] = $this->config['url'] . 'currentPage-' . $i;
        }
        $postUrls = [];
        foreach ($pageUrls as $url) {
            $page = $this->downloadPage($url);
            $phpquery = $this->createPhpQuery($page);
            $links = $phpquery->find(".discussionListItems .title a");
            foreach ($links as $link) {
                $url = pq($link)->attr('href');
                $postUrls[] = 'http://www.blackhatworld.com/' . $url;
            }
        }
        foreach ($postUrls as $url) {
            $page = $this->downloadPage($url);
            $phpquery = $this->createPhpQuery($page);
            $addresses = $this->fetchAddresses($page);
            $this->addServers($addresses);

            $next = $phpquery->find(".PageNav a:last");
            $next = pq($next);
            while ($next->text() === "Next >") {
                $url2 = 'http://www.blackhatworld.com/' . $next->attr('href');
                $page2 = $this->downloadPage($url2);
                $addresses2 = $this->fetchAddresses($page2);
                $this->addServers($addresses2);
                $phpquery2 = $this->createPhpQuery($page2);
                $next = pq($phpquery2->find('.PageNav a:last'));
            }
        }
    }
}