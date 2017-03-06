<?php

namespace App\Proxy;

use \App\Proxy\Service\Exception\EmptyPagesLimit as EmptyPagesLimitExcetion;

class Proxy
{
    public function __construct()
    {
        $this->config = \Config::get('proxy');
        foreach ($this->config['services'] as $data)
        {
            if ( ! empty($data['disabled'])) continue;
            $className = "\App\Proxy\Service\\" . $data['service_name'];
            $class = new $className($data);
            if ( ! ($class instanceof \App\Proxy\Service\AbstractService))
            {
                throw new \Exception('Bad class.');
            }
            $this->services[] = $class;
        }

        if (!defined('CURLOPT_TIMEOUT_MS')) define('CURLOPT_TIMEOUT_MS', 155);
        if (!defined('CURLOPT_CONNECTTIMEOUT_MS')) define('CURLOPT_CONNECTTIMEOUT_MS', 156);
    }

    public function testOldHttp($servers)
    {
        $client = new \Guzzle\Http\Client(\Config::get('proxy.check_server_url_http'));
        $requests = array();
        $responses = array();
        foreach ($servers as $server)
        {
            $requests[] = $client->get(
                \Config::get('proxy.test_server_old_http_path'),
                array(),
                array(
                    'proxy'           => "tcp://{$server->address}",
                    'query'           => array('start' => microtime(true), 'ip' => $server->getIp(), 'port' => $server->getPort(), 'id' => $server->id),
                    'timeout'         => 40,
                    'connect_timeout' => 20
                )
            );

            $server->is_checked = 1;
            $server->checked_at = date('Y-m-d H:i:s');
            $server->ping_error++;
            $server->save();
        }
        $ids = array();
        $successfullIds = array();
        $failedIds = array();
        try
        {
            $responses = $client->send($requests);
            foreach ($responses as $response)
            {
                $body = (string)$response->getBody();
                preg_match('#proxy_test\:\:(.*)\:\:proxy_test#', $body, $matches);
                if (!empty($matches[1]))
                {
                    $data = json_decode($matches[1]);
                    $successfullIds[] = $data->id;
                }
            }
        }
        catch (\Guzzle\Http\Exception\MultiTransferException $e)
        {
            $successfulRequests = $e->getSuccessfulRequests();
            foreach ($successfulRequests as $request)
            {
                $response = (string)$request->getResponse()->getBody();
                $query = $request->getQuery();
                if ($server = \App\AvailableServer::where('address', '=', $query['address'])->find())
                {
                    if (preg_match('#proxy_test\:\:(.*)\:\:proxy_test#', $response))
                    {
                        $server->no_redirect = 1;
                    }
                    else
                    {
                        $server->no_redirect = 0;
                    }
                    if (strpos($response, "script") !== false)
                    {
                        $server->is_hacked = 1;
                        preg_match('/<\s*script[^>]*>[\s\S]*?(<\s*\/script[^>]*>|$)/i', $response, $script_matches);
                        if (isset($script_matches[0]))
                        {
                            file_put_contents(app_path() . '/storage/proxiee/hacked/' . $server->address . '.txt', $script_matches[0]);
                        }
                    }
                    else
                    {
                        $server->is_hacked = 0;
                    }
                    $server->save();
                    $ids[] = $successfullIds[] = $server->id;
                }
            }

            $failedRequests = $e->getFailedRequests();
            foreach ($failedRequests as $request)
            {
                $exception = $e->getExceptionForFailedRequest($request);
                $query = $request->getQuery();
                $ids[] = $failedIds[] = $query['id'];
                $server = \App\Server::find($query['id']);
                if ($server)
                {
                    preg_match('#\[status code\]\s(\d+)#', $exception->getMessage(), $matches);
                    if (!empty($matches[1]))
                    {
                        $server->last_status_code = $matches[1];
                    }
                    preg_match('#\[curl\]\s([a-zA-Z0-9\s\:\.]+)#', $exception->getMessage(), $matches);
                    if (!empty($matches[1]))
                    {
                        $server->last_error_message = $matches[1];
                    }
                    if ($server->first_ping === '0000-00-00 00:00:00')
                    {
                        $server->first_ping = date('Y-m-d H:i:s');
                    }
                    $server->save();
                }
            }
        }
        self::log('Successed count: ' . count($successfullIds));
        var_dump($successfullIds);
    }

    public function testSocks($servers)
    {
        $client = new \Guzzle\Http\Client('http://195.154.179.219:8080');
        $requests = array();
        $responses = array();
        foreach ($servers as $server)
        {
            $request = $client->get(
                "/~hud/proxy/proxy_test_socks",
                array(),
                array(
                    'proxy'           => "{$server->address}",
                    'query'           => array('start' => microtime(true), 'ip' => $server->getIp(), 'port' => $server->getPort(), 'id' => $server->id),
                    'timeout'         => 40,
                    'connect_timeout' => 20
                )
            );
            $request->getCurlOptions()->set(CURLOPT_PROXYTYPE, CURLPROXY_SOCKS5);
            $requests[] = $request;

            $server->is_available = 0;
            $server->type = $server->ping = $server->speed = null;
            $server->is_checked_socks = 1;
            $server->checked_at = date('Y-m-d H:i:s');
            $server->no_redirect = null;
            $server->is_hacked = 0;
            $server->ping_error++;
            $server->save();
        }
        $ids = array();
        $successfullIds = array();
        $failedIds = array();
        try
        {
            $responses = $client->send($requests);
            foreach ($responses as $response)
            {
                $body = (string)$response->getBody();
                preg_match('#proxy_test\:\:(.*)\:\:proxy_test#', $body, $matches);
                if (!empty($matches[1]))
                {
                    $data = json_decode($matches[1]);
                    $successfullIds[] = $data->id;
                }
            }
        }
        catch (\Guzzle\Http\Exception\MultiTransferException $e)
        {
            $successfulRequests = $e->getSuccessfulRequests();
            foreach ($successfulRequests as $request)
            {
                $response = (string)$request->getResponse()->getBody();
                $query = $request->getQuery();
                if ($server = \Server::find($query['id']))
                {
                    if (preg_match('#proxy_test\:\:(.*)\:\:proxy_test#', $response))
                    {
                        $server->no_redirect = 1;
                    }
                    else
                    {
                        $server->no_redirect = 0;
                    }
                    if (strpos($response, "script") !== false)
                    {
                        $server->is_hacked = 1;
                        preg_match('/<\s*script[^>]*>[\s\S]*?(<\s*\/script[^>]*>|$)/i', $response, $script_matches);
                        if (isset($script_matches[0]))
                        {
                            file_put_contents(app_path() . '/storage/proxiee/hacked/' . $server->address . '.txt', $script_matches[0]);
                        }
                    }
                    else
                    {
                        $server->is_hacked = 0;
                    }
                    $server->save();
                    $ids[] = $successfullIds[] = $query['id'];
                }
            }

            $failedRequests = $e->getFailedRequests();
            foreach ($failedRequests as $request)
            {
                $exception = $e->getExceptionForFailedRequest($request);
                $query = $request->getQuery();
                $ids[] = $failedIds[] = $query['id'];
                $server = \Server::find($query['id']);
                if ($server)
                {
                    preg_match('#\[status code\]\s(\d+)#', $exception->getMessage(), $matches);
                    if (!empty($matches[1]))
                    {
                        $server->last_status_code = $matches[1];
                    }
                    preg_match('#\[curl\]\s([a-zA-Z0-9\s\:\.]+)#', $exception->getMessage(), $matches);
                    if (!empty($matches[1]))
                    {
                        $server->last_error_message = $matches[1];
                    }
                    if ($server->first_ping === '0000-00-00 00:00:00')
                    {
                        $server->first_ping = date('Y-m-d H:i:s');
                    }
                    $server->save();
                }
            }
        }
        self::log('Successed count: ' . count($successfullIds));
    }

    public function testSocksOnline($servers)
    {
        $client = new \Guzzle\Http\Client('http://195.154.179.219:8080');
        $requests = array();
        $responses = array();
        foreach ($servers as $server)
        {
            $request = $client->get(
                "/~hud/proxy/proxy_test_socks_online",
                array(),
                array(
                    'proxy'           => "{$server->address}",
                    'query'           => array('start' => microtime(true), 'ip' => $server->getIp(), 'port' => $server->getPort(), 'id' => $server->id),
                    'timeout'         => 60,
                    'connect_timeout' => 60
                )
            );
            $request->getCurlOptions()->set(CURLOPT_PROXYTYPE, CURLPROXY_SOCKS5);
            $requests[] = $request;
        }
        $successfullIds = array();
        try
        {
            $responses = $client->send($requests);
            foreach ($responses as $response)
            {
                $body = (string)$response->getBody();
                preg_match('#proxy_test\:\:(.*)\:\:proxy_test#', $body, $matches);
                if (!empty($matches[1]))
                {
                    $data = json_decode($matches[1]);
                    $successfullIds[] = $data->id;
                }
            }
        }
        catch (\Guzzle\Http\Exception\MultiTransferException $e)
        {
            $successfulRequests = $e->getSuccessfulRequests();
            foreach ($successfulRequests as $request)
            {
                $query = $request->getQuery();
                if ($server = \Server::find($query['id']))
                {
                    $successfullIds[] = $query['id'];
                }
            }
        }
        return $successfullIds;
    }

    public function fetchFrom($from, $url)
    {
        $config = array();
        if ($url)
        {
            $config['url'] = $url;
        }
        $config['sourpce'] = $from;
        $class = '\Proxy\Service\\' . $from;
        $object = new $class($config);
        $object->getAllPages($url);
    }

    public static function log($str)
    {
        $str = '[' . date('Y-m-d H:i:s') . "]\t" . $str . PHP_EOL;
        echo $str;
    }

    public static function validateAddress($ip, $port)
    {
        return preg_match('/^(\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b)\:(\d+)$/', $ip . ':' . $port);
    }

    public static function addServers(array $servers, $source)
    {
        foreach ($servers as $address)
        {
            $address['ip'] = trim($address['ip']);
            $address['port'] = trim($address['port']);

            if (self::validateAddress($address['ip'], $address['port']))
            {
                $model = new \Server;
                $model->address = $address['ip'] . ':' . $address['port'];
                $model->source = $source;
                try
                {
                    $model->save();
                    if (TRUE)
                    {
                        \App\Proxy\Proxy::log("Adding proxy: {$address['ip']}:{$address['port']}");
                    }
                }
                catch (\Exception $e)
                {
                    var_dump($e->getMessage());
                }
            }
        }
    }

    public function fetch()
    {
        foreach($this->services as $key => $service)
        {
            try
            {
                $service->process();
            }
            catch(EmptyPagesLimitExcetion $e)
            {
                continue;
            }
        }
    }
}