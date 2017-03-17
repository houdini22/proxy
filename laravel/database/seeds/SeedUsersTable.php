<?php

use Cartalyst\Sentinel\Laravel\Facades\Sentinel;
use Cartalyst\Sentinel\Laravel\Facades\Activation;
use Illuminate\Database\Seeder;

class SeedUsersTable extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $credentials = [
            'email' => 'baniczek@gmail.com',
            'password' => 'BaDmIkE1!##&',
        ];

        $user = Sentinel::register($credentials);
        $user->newsletter = TRUE;
        $user->token = str_random(32);
        $user->save();

        $activation = Activation::create($user);
        Activation::complete($user, $activation->getCode());

        $role = Sentinel::getRoleRepository()->createModel()->create([
            'name' => 'Admin',
            'slug' => 'admin',
        ]);
        $user->permissions = [
            'server.import' => TRUE,
            'server.filter_all' => TRUE,
            'server.no_pages_limit' => TRUE,
            'table.auto_refresh' => TRUE,
        ];
        $user->save();
    }
}
