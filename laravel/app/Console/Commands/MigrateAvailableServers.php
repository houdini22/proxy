<?php

namespace App\Console\Commands;

use App\AvailableServer;
use App\Server;
use Illuminate\Console\Command;

class MigrateAvailableServers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:MigrateAvailableServers';

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
        ini_set('mysql.connect_timeout', 3600);
        ini_set('default_socket_timeout', 3600);

        $servers = Server::where('is_available', '=', 1)->get();
        foreach ($servers as $server) {
            $newServer = new AvailableServer();

            $newServer->address = $server->address;
            $newServer->type = $server->type;
            $newServer->ping = $server->ping;
            $newServer->speed = 0;
            $newServer->is_checked_speed = 0;
            $newServer->country = $server->country;
            $newServer->country_code = $server->country_code;
            $newServer->region_code = $server->region_code;
            $newServer->region_name = $server->region_name;
            $newServer->city = $server->city;
            $newServer->zip = $server->zip;
            $newServer->lat = $server->lat;
            $newServer->lon = $server->lon;
            $newServer->timezone = $server->timezone;
            $newServer->isp = $server->isp;
            $newServer->organization = $server->organization;
            $newServer->is_hacked = $server->is_hacked;
            $newServer->ping_success = $server->ping_success;
            $newServer->ping_error = $server->ping_error;
            $newServer->speed_success = $server->speed_success;
            $newServer->speed_error = $server->speed_error;
            $newServer->is_available = 1;
            $newServer->was_available = 1;
            $newServer->last_availability = $server->last_availability;
            $newServer->no_redirect = $server->no_redirect;
            $newServer->last_status_code = $server->last_status_code;
            $newServer->last_error_message = $server->last_error_message;
            $newServer->first_ping = $server->first_ping;
            $newServer->checked_at = $server->checked_at;
            $newServer->is_checked = 1;
            $newServer->is_checked_socks = 1;
            $newServer->is_socks = 1;
            $newServer->test_disabled = 0;

            $newServer->save();
        }
    }
}
