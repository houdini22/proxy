<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class TestProxiesHttpOld extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:TestProxiesHttpOld';

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
        set_time_limit(0);
        ini_set('mysql.connect_timeout', 300);
        ini_set('default_socket_timeout', 300);

        $servers = \App\Server::take(200)
            ->orderBy(\DB::raw('RAND()'))
            ->where('is_available', '=', 1)
            ->get();

        \App\Proxy\Proxy::log('Count: ' . count($servers));

        $proxy = new \App\Proxy\Proxy;
        $proxy->testOldHttp($servers);
    }
}
