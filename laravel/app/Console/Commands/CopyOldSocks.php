<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CopyOldSocks extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:CopyOldSocks';

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
        $servers = \App\OldAvailableServer::get();
        foreach ($servers as $s) {
            $new = new \App\AvailableServer();
            $new->address = $s->address;
            $new->ip = $s->getIp();
            $new->port = $s->getPort();
            $new->is_checked = 0;
            $new->is_checked_speed = $s->speed === NULL ? 0 : 1;
            $new->type = $s->type;
            $new->ping = $s->ping;
            $new->was_available = 1;
            $new->is_available = 0;
            $new->last_availability = $s->last_availability;
            $new->no_redirect = $s->no_redirect;
            $new->country = $s->country;
            $new->country_code = $s->country_code;
            $new->region_code = $s->region_code;
            $new->region_name = $s->region_name;
            $new->city = $s->city;
            $new->zip = $s->zip;
            $new->lon = $s->lon;
            $new->lat = $s->lat;
            $new->timezone = $s->timezone;
            $new->organization = $s->organization;
            $new->isp = $s->isp;
            $new->is_checked_socks = 0;
            $new->is_socks = 1;
            $new->speed = empty($s->speed) ? NULL : $s->speed;
            $new->ping_socks_success = 1;
            $new->ping_socks_error = 0;
            $new->first_ping = $s->first_ping;
            $new->speed_success = 0;
            $new->speed_error = 0;
            $new->speed_checked_at = $s->speed_checked_at;
            $new->ping_success = 0;
            $new->ping_error = 0;
            $new->is_hacked = $s->is_hacked;
            $new->save();
        }
    }
}
