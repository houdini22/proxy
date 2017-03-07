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
            ->take(5)
            ->orderBy(\DB::raw('RAND()'))
            ->get();
        $client = new \Guzzle\Http\Client(\Config::get('proxy.check_server_url_http'));
        $requests = array();
        $responses = array();
        $filesize = filesize(base_path() . '/../public/files/test_file');
        foreach ($servers as $server)
        {
            $request = $client->get(\Config::get('proxy.test_server_speed_path'), array(), array(
                'proxy' => "tcp://{$server->address}",
                'timeout' => 50,
                'connect_timeout' => 10
            ));
            $start = microtime(true);

            $server->is_checked_speed = 1;
            $server->speed_checked_at = date('Y-m-d H:i:s');

            try
            {
                $response = $client->send($request);
                $body = (string) $response->getBody();

                $time = microtime(TRUE) - $startTime;

                $server->speed = round($filesize / $time);
                $server->speed_success++;

                \App\Proxy\Proxy::log("Speed: " . $server->speed);
            }
            catch (\Exception $e)
            {
                \App\Proxy\Proxy::log($e->getMessage());
                preg_match("#milliseconds with (\d+) out of $filesize#", $e->getMessage(), $matches);
                if ( ! empty($matches[1]))
                {
                    $server->speed = round($matches[1] / $time);
                    $server->speed_success++;

                    \App\Proxy\Proxy::log("Speed: " . $server->speed);
                }
                else
                {
                    $server->speed = NULL;
                    $server->speed_error++;

                    \App\Proxy\Proxy::log("ERROR: " . $server->address);
                }
            }
            $server->save();
        }
    }
}
