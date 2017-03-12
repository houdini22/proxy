<?php

namespace App\Console;

use App\Console\Commands\CopyOldSocks;
use App\Console\Commands\FetchProxies;
use App\Console\Commands\MigrateAvailableServers;
use App\Console\Commands\TestOldAvailableServers;
use App\Console\Commands\TestProxiesHttpOld;
use App\Console\Commands\TestProxiesSocks;
use App\Console\Commands\TestProxiesSpeed;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        MigrateAvailableServers::class,
        FetchProxies::class,
        TestProxiesHttpOld::class,
        TestProxiesSpeed::class,
        TestProxiesSocks::class,
        TestOldAvailableServers::class,
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // $schedule->command('inspire')
        //          ->hourly();
    }

    /**
     * Register the Closure based commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        require base_path('routes/console.php');
    }
}
