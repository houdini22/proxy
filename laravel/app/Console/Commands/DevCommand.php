<?php

namespace App\Console\Commands;

use App\AvailableServer;
use Illuminate\Console\Command;

class DevCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:DevCommand';

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
        $servers = AvailableServer::where('ping_sum', '=', 0)->get();
        foreach ($servers as $s) {
            $s->ping_sum = floatval($s->ping) * intval($s->ping_success);
            echo PHP_EOL . $s->ping_sum . PHP_EOL;
            $s->save();
        }
        echo PHP_EOL . count($servers) . PHP_EOL;
    }
}
