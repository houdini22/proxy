<?php

namespace App\Proxy\Service;

use App\Proxy\Service\Exception\EmptyPagesLimit as EmptyPagesLimit;

abstract class AbstractService
{
    protected $config = array();
    protected $loadedPages = array();
    protected $loadedPagesQuery = array();
    protected $emptyPagesCount = 0;

    public function __construct(array $config = array())
    {
        if ($config) {
            $this->config = $config;
            $this->config['url_parsed'] = parse_url($config['url']);
        } else {
            $this->config = array();
            $this->config['url_parsed'] = parse_url($this->url);
        }
    }

    public function getSource()
    {
        if (!property_exists($this, 'source')) {
            throw new \Exception('Set a source!');
        }
        return $this->source;
    }

    public function downloadPage($link = NULL, array $headers = array())
    {
        $url = $this->config['url'];
        $response = "";
        \App\Proxy\Proxy::log("Connecting to: " . $link);
        try {
            $client = new \Guzzle\Http\Client($url);
            $client->setUserAgent('Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36');
            $request = $client->get($link, $headers);
            $response = (string)$request->send()->getBody();
        } catch (\Exception $e) {
            \App\Proxy\Proxy::log("Exception: {$e->getMessage()}");
        }

        return $response;
    }

    public function createPhpQuery($html)
    {
        return \phpQuery::newDocumentHTML($html);
    }

    public function isDisabled()
    {
        return $this->config['disabled'] !== TRUE;
    }

    public function validateAddress($ip, $port)
    {
        return preg_match('/^(\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b)\:(\d+)$/', $ip . ':' . $port);
    }

    public function addServers(array $servers)
    {
        $empty = TRUE;
        foreach ($servers as $address) {
            $address['ip'] = trim($address['ip']);
            $address['port'] = trim($address['port']);

            if ($this->validateAddress($address['ip'], $address['port'])) {
                $model = new \App\Server;
                $model->address = $address['ip'] . ':' . $address['port'];
                $model->source = $this->getSource();
                try {
                    $model->save();
                    $empty = FALSE;
                    \App\Proxy\Proxy::log("Adding proxy: {$address['ip']}:{$address['port']}");
                } catch (\Exception $e) {
                    //var_dump($e->getMessage());
                }
            }
        }

        if ($empty) {
            $this->emptyPagesCount++;
        } else {
            $this->emptyPagesCount = 0;
        }

        if ($this->emptyPagesCount > 10 && empty($this->config['disable_empty_limit'])) {
            throw new EmptyPagesLimit;
        }
    }

    public function fetchAddresses($html)
    {
        $result = array();
        if (preg_match_all('/(\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b):(\d+)/', $html, $matches, PREG_SET_ORDER)) {
            foreach ($matches as $match) {
                $server = array('ip' => $match[1], 'port' => (int)$match[2]);
                $result[] = $server;
            }
        }

        return $result;
    }
}
