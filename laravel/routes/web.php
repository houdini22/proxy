<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

use Illuminate\Http\Request;
use Mews\Captcha\Facades\Captcha;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/captcha', function() {
    return Captcha::img('flat');
});

Route::group(['prefix' => 'api', 'middleware' => ['web']], function () {
    Route::group(['prefix' => 'v1'], function () {
        Route::get('/statistics', 'ApiV1Controller@getStatistics');
        Route::get('/servers', 'ApiV1Controller@getServers');
        Route::get('/address/{token}', 'ApiV1Controller@getAddress');
        Route::post('/register', 'ApiV1Controller@postRegister');
    });
    Route::get('/', function () {
        return "API";
    });
});

Route::get('/proxy_test_old', function (Request $request) {
    $oldServer = \App\Server::where('address', '=', $request->query('ip') . ':' . $request->query('port'))->first();
    $oldServer->is_available = $oldServer->was_available = $oldServer->test_disabled = 1;
    if ($oldServer->first_ping === '0000-00-00 00:00:00') {
        $oldServer->first_ping = date('Y-m-d H:i:s');
    }
    $oldServer->last_availability = date('Y-m-d H:i:s');
    $oldServer->ping_error -= 1;
    $oldServer->ping_success += 1;
    $oldServer->save();

    $json = array('id' => NULL);
    if ($oldServer) {
        $server = \App\AvailableServer::where('address', '=', $request->query('ip') . ':' . $request->query('port'))->first();
        if (!$server) {
            $server = new \App\AvailableServer();
            $server->address = $oldServer->address;
            $server->port = $oldServer->getPort();
            $server->ip = $oldServer->getIp();
        }

        if (empty($_SERVER['HTTP_X_FORWARDED_FOR']) AND empty($_SERVER['HTTP_VIA']) AND empty($_SERVER['HTTP_PROXY_CONNECTION'])) {
            $server->type = 'elite';
        } elseif (empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $server->type = 'anonymous';
        } else {
            $server->type = 'transparent';
        }

        $server->is_checked = $server->is_available = $server->was_available = 1;
        $server->ping = microtime(true) - (float)$request->query('start');
        $server->first_ping = $oldServer->first_ping;
        if ($server->first_ping === '0000-00-00 00:00:00') {
            $server->first_ping = date('Y-m-d H:i:s');
        }
        $server->checked_at = $oldServer->checked_at;
        $server->last_availability = date('Y-m-d H:i:s');
        $server->ping_success = 1;
        $server->is_checked_speed = 0;
        $server->save();

        $json['id'] = $server->id;
        $json['address'] = $server->address;

        $client = new \Guzzle\Http\Client('http://ip-api.com/');
        $request = $client->get("/php/" . $request->query('ip'), array(), array(
            'timeout' => 10,
            'connect_timeout' => 2
        ));
        if (empty($server->country)) {
            try {
                $response = $request->send();
                $body = (string)$response->getBody();
                $result = unserialize($body);
            } catch (\Exception $e) {
                $result = array();
            }
            if (!empty($result['status']) AND $result['status'] === 'success') {
                $server->country = !empty($result['country']) ? $result['country'] : NULL;
                $server->country_code = !empty($result['countryCode']) ? $result['countryCode'] : NULL;
                $server->region_code = !empty($result['region']) ? $result['region'] : NULL;
                $server->region_name = !empty($result['regionName']) ? $result['regionName'] : NULL;
                $server->city = !empty($result['city']) ? $result['city'] : NULL;
                $server->zip = !empty($result['zip']) ? $result['zip'] : NULL;
                $server->lat = !empty($result['lat']) ? $result['lat'] : NULL;
                $server->lon = !empty($result['lon']) ? $result['lon'] : NULL;
                $server->timezone = !empty($result['timezone']) ? $result['timezone'] : NULL;
                $server->isp = !empty($result['isp']) ? $result['isp'] : NULL;
                $server->organization = !empty($result['org']) ? $result['org'] : NULL;
                $server->save();
            }
        }
    }
    echo 'proxy_test::';
    echo json_encode($json);
    echo '::proxy_test';
});

Route::get('/proxy_test_socks', function (Request $request) {

    $server = \App\AvailableServer::where('address', '=', $request->query('ip') . ':' . $request->query('port'))->first();
    $json = array('id' => NULL);

    if ($server) {
        $server->ping_socks_error -= 1;
        $server->ping_socks_success += 1;
        $server->is_available = $server->was_available = 1;
        $server->ping = microtime(true) - (float)$request->query('start');
        $server->last_availability = date('Y-m-d H:i:s');
        $server->is_checked_speed = 0;
        $server->speed = NULL;
        $server->save();

        $client = new \Guzzle\Http\Client('http://ip-api.com/');
        $request = $client->get("/php/" . $request->query('ip'), array(), array(
            'timeout' => 10,
            'connect_timeout' => 2
        ));

        try {
            $response = $request->send();
            $body = (string)$response->getBody();
            $result = unserialize($body);
        } catch (\Exception $e) {
            $result = array();
        }
        if (!empty($result['status']) AND $result['status'] === 'success') {
            $server->country = !empty($result['country']) ? $result['country'] : NULL;
            $server->country_code = !empty($result['countryCode']) ? $result['countryCode'] : NULL;
            $server->region_code = !empty($result['region']) ? $result['region'] : NULL;
            $server->region_name = !empty($result['regionName']) ? $result['regionName'] : NULL;
            $server->city = !empty($result['city']) ? $result['city'] : NULL;
            $server->zip = !empty($result['zip']) ? $result['zip'] : NULL;
            $server->lat = !empty($result['lat']) ? $result['lat'] : NULL;
            $server->lon = !empty($result['lon']) ? $result['lon'] : NULL;
            $server->timezone = !empty($result['timezone']) ? $result['timezone'] : NULL;
            $server->isp = !empty($result['isp']) ? $result['isp'] : NULL;
            $server->organization = !empty($result['org']) ? $result['org'] : NULL;
            $server->save();
        }

        $json['id'] = $server->id;
        $json['address'] = $server->address;
    }

    echo 'proxy_test::';
    echo json_encode($json);
    echo '::proxy_test';
});