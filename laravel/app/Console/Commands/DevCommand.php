<?php

namespace App\Console\Commands;

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
        $servers = \App\AvailableServer::get();
        $i = 0;
        foreach ($servers as $s) {
            $old = \App\Server::where('address', '=', $s->address)->first();
            $old->test_disabled = 1;
            $old->was_available = 1;
            $old->is_socks = $s->is_socks;
            $old->save();
            $i += 1;
            echo $i . '/' . count($servers);
        }
    }
}
