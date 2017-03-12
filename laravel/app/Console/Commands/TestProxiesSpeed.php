<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class TestProxiesSpeed extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:TestProxiesSpeed';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $startTime = microtime(true);
        $servers = \App\AvailableServer::where('is_available', 1)
            ->where('is_checked_speed', '=', 0)
            ->where('is_available', '=', 1)
            ->take(5)
            ->orderBy(\DB::raw('RAND()'))
            ->get();

        $requests = array();
        $responses = array();
        $filesize = filesize(base_path() . '/../public/files/test_file');

        foreach ($servers as $server) {
            $client = new \Guzzle\Http\Client($server->is_socks ? \Config::get('proxy.check_server_url_socks') : \Config::get('proxy.check_server_url_http'));
            $request = $client->get(\Config::get('proxy.test_server_speed_path'), array(), array(
                'proxy' => $server->is_socks ? $server->address : "tcp://{$server->address}",
                'timeout' => 40,
                'connect_timeout' => 20
            ));

            if ($server->is_socks) {
                $request->getCurlOptions()->set(CURLOPT_PROXYTYPE, CURLPROXY_SOCKS5);
            }

            $start = microtime(true);

            $server->is_checked_speed = 1;
            $server->speed_checked_at = date('Y-m-d H:i:s');

            try {
                $response = $client->send($request);
                $body = (string)$response->getBody();

                $time = microtime(TRUE) - $startTime;

                $server->speed = round($filesize / $time);
                $server->speed_success++;
                $server->last_speed_error_status_code = $server->last_speed_error_message = NULL;

                \App\Proxy\Proxy::log("SPEED: {$server->address}: {$server->speed} {$server->is_socks}");
            } catch (\Exception $e) {
                \App\Proxy\Proxy::log($e->getMessage());

                preg_match("#milliseconds with (\d+) out of $filesize#", $e->getMessage(), $matches);

                if (!empty($matches[1])) {
                    $time = microtime(TRUE) - $startTime;

                    $server->speed = round($matches[1] / $time);
                    $server->speed_success++;

                    $server->last_speed_error_status_code = $server->last_speed_error_message = NULL;

                    \App\Proxy\Proxy::log("SPEED: {$server->address}: {$server->speed} {$server->is_socks}");
                } else {
                    $server->speed = NULL;
                    $server->speed_error++;

                    preg_match('#\[status code\]\s(\d+)#', $e->getMessage(), $matches);

                    if (!empty($matches[1])) {
                        $server->last_speed_error_status_code = $matches[1];
                    } else {
                        $server->last_speed_error_status_code = '';
                    }
                    preg_match('#\[curl\]\s([a-zA-Z0-9\s\:\.]+)#', $e->getMessage(), $matches);
                    if (!empty($matches[1])) {
                        $server->last_speed_error_message = $matches[1];
                    } else {
                        $server->last_speed_error_message = '';
                    }

                    \App\Proxy\Proxy::log("ERROR: {$server->address} NULL {$server->is_socks}");
                }
            }
            $server->save();
        }
    }
}
