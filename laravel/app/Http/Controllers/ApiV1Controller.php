<?php

namespace App\Http\Controllers;

use App\AvailableServer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ApiV1Controller extends Controller
{
    public function getStatistics(Request $request)
    {
        $response = [];

        $response['nb_servers_available_in_past'] = Cache::remember('nb_servers_available_in_past', 5, function () {
            return AvailableServer::count();
        });
        $response['nb_servers_available_now'] = Cache::remember('nb_servers_available_now', 5, function () {
            return AvailableServer::where('is_available', '=', 1)->count();
        });
        $response['nb_server_countries'] = Cache::remember('nb_server_countries', 5, function () {
            return AvailableServer::distinct('country')->whereNotNull('country')->select('country')->groupBy('country')->get()->count();
        });
        $response['nb_server_cities'] = Cache::remember('nb_server_cities', 5, function () {
            return AvailableServer::distinct('city')->whereNotNull('city')->select('city')->groupBy('city')->get()->count();
        });

        return JsonResponse::create($response);
    }
}
