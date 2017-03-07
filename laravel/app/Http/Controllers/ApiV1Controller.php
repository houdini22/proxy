<?php

namespace App\Http\Controllers;

use App\AvailableServer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Psy\Util\Json;

class ApiV1Controller extends Controller
{
    protected $_token = '*H&*OUNAuibfiu*H*&A*BbbNBTYT';

    public function getStatistics(Request $request)
    {
        $cacheLifetime = 29 / 60;
        $response = [];

        $response['nb_servers_available_in_past'] = Cache::remember('nb_servers_available_in_past', $cacheLifetime, function () {
            return AvailableServer::count();
        });
        $response['nb_servers_available_today'] = Cache::remember('nb_servers_available_today', $cacheLifetime, function () {
            return AvailableServer::where(\DB::raw('DATE(last_availability)'), '=', date('Y-m-d'))
                ->count();
        });
        $response['nb_server_countries'] = Cache::remember('nb_server_countries', $cacheLifetime, function () {
            return AvailableServer::distinct('country')
                ->whereNotNull('country')
                ->select('country')
                ->groupBy('country')
                ->get()
                ->count();
        });
        $response['nb_server_cities'] = Cache::remember('nb_server_cities', $cacheLifetime, function () {
            return AvailableServer::distinct('city')
                ->whereNotNull('city')
                ->select('city')
                ->groupBy('city')
                ->get()
                ->count();
        });
        $response['nb_servers_available_past_15min'] = Cache::remember('nb_servers_available_past_15min', $cacheLifetime, function () {
            return AvailableServer::orderBy('checked_at', 'DESC')
                ->where('is_available', '=', 1)
                ->where('last_availability', '>', date('Y-m-d H:i:s', time() - (15 * 60)))
                ->get()
                ->count();
        });
        $response['nb_servers_socks5_online'] = Cache::remember('nb_servers_socks5_online', $cacheLifetime, function () {
            return AvailableServer::where('is_socks', '=', 1)
                ->where('is_available', '=', 1)
                ->get()
                ->count();
        });
        $response['nb_servers_socks5_available'] = Cache::remember('nb_servers_socks5_available', $cacheLifetime, function () {
            return AvailableServer::where('is_socks', '=', 1)
                ->get()
                ->count();
        });

        return JsonResponse::create($response);
    }

    public function getServers(Request $request)
    {
        $servers = AvailableServer::orderBy('id', 'DESC')
            ->select([
                'address', 'type', 'ping', 'speed', 'no_redirect', 'ping_success', 'ping_error', 'speed_success', 'speed_error',
                'checked_at', 'speed_checked_at', 'is_socks', 'is_checked_speed',
                'country', 'country_code', 'region_code', 'region_name', 'city', 'zip', 'lat', 'lon', 'timezone', 'isp', 'organization'
            ]);

        switch ($request->query('availability', 'online')) {
            case 'online':
                $servers->where('is_available', '=', 1);
                break;

            case 'offline':
                $servers->where('is_available', '=', 0);
                break;
        }

        switch ($request->query('type', 'all')) {
            case 'http_elite':
                $servers->where('is_socks', '=', 0)
                    ->where('type', '=', 'elite');
                break;

            case 'http_anonymous':
                $servers->where('is_socks', '=', 0)
                    ->where('type', '=', 'anonymous');
                break;

            case 'http_transparent':
                $servers->where('is_socks', '=', 0)
                    ->where('type', '=', 'transparent');
                break;

            case 'socks5_elite':
                $servers->where('is_socks', '=', 1);
                break;
        }

        switch ($request->query('ping')) {
            case 'fastest':
                $servers->where('ping', '<', 3);
                break;

            case 'fast':
                $servers->where('ping', '>=', 3)
                    ->where('ping', '<', 10);
                break;

            case 'medium':
                $servers->where('ping', '>=', 10)
                    ->where('ping', '<', 25);
                break;

            case 'slow':
                $servers->where('ping', '>=', 25);
                break;
        }

        switch ($request->query('speed')) {
            case 'slow':
                $servers->where(function($query) {
                    $query->where('speed', '<', 2048)
                        ->orWhereNull('speed');
                });
                break;

            case 'medium':
                $servers->where('speed', '>=', 2048)
                    ->where('speed', '<', 10240);
                break;

            case 'fast':
                $servers->where('speed', '>=', 10240)
                    ->where('speed', '<', 25600);
                break;

            case 'fastest':
                $servers->where('speed', '>=', 25600);
                break;
        }

        $response = $servers->paginate()->toArray();

        foreach ($response['data'] as & $server) {
            $server['address_img_url'] = url('/api/v1/address/' . md5($server['address'] . $this->_token));
            $server['checked_at'] = \App\Date::fuzzy_span(strtotime($server['checked_at']));
            unset($server['address']);
        }

        return JsonResponse::create($response);
    }

    public function getAddress(Request $request)
    {
        $token = $request->route('token');
        $server = AvailableServer::where(\DB::raw('md5(CONCAT(address, "' . $this->_token . '"))'), $token)->first();

        if ($server) {
            $pathDisk = base_path() . '/../public/files/addresses/' . $token . '.png';
            if (!file_exists($pathDisk)) {
                $im = imagecreatetruecolor(160, 23);
                $background_color = imagecolorallocate($im, 255, 255, 255);
                imagefill($im, 0, 0, $background_color);
                $text_color = imagecolorallocate($im, 0, 0, 0);
                imagestring($im, 3, 5, 5, $server->address, $text_color);
                imagepng($im, $pathDisk);
            }
            return response()->file($pathDisk);
        } else {
            dd($server);
        }
    }
}
