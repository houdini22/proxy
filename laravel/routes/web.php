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

Route::group(['prefix' => 'api', 'middleware' => ['web', 'secure']], function () {
    Route::group(['prefix' => 'v1'], function () {
        Route::get('/statistics', 'ApiV1Controller@getStatistics');
        Route::get('/servers', 'ApiV1Controller@getServers');
        Route::get('/address/{token}', 'ApiV1Controller@getAddress');
        Route::post('/register', 'ApiV1Controller@postRegister');
        Route::get('/confirm_account/{token}/{code}', 'ApiV1Controller@getConfirmAccount');
        Route::post('/login', 'ApiV1Controller@postLogin');
        Route::get('/logout', 'ApiV1Controller@getLogout');
        Route::post('/import', 'ApiV1Controller@postImport');
        Route::get('/session', 'ApiV1Controller@getSession');
    });
    Route::get('/', function () {
        return "API";
    });
});

$checkAnonymity = function () {
    $headers = array(
        'HTTP_X_REAL_IP',
        'HTTP_X_FORWARDED_FOR',
        'HTTP_X_PROXY_ID',
        'HTTP_VIA',
        'HTTP_X_FORWARDED_FOR',
        'HTTP_FORWARDED_FOR',
        'HTTP_X_FORWARDED',
        'HTTP_FORWARDED',
        'HTTP_CLIENT_IP',
        'HTTP_FORWARDED_FOR_IP',
        'VIA',
        'X_FORWARDED_FOR',
        'FORWARDED_FOR',
        'X_FORWARDED FORWARDED',
        'CLIENT_IP',
        'FORWARDED_FOR_IP',
        'HTTP_PROXY_CONNECTION',
        'HTTP_XROXY_CONNECTION'
    );

    $level = FALSE;
    foreach ($headers as $headerName) {
        if (isset($_SERVER[$headerName])) {
            $level = 'transparent';
            break;
        }
    }
    if($level === FALSE) {
        $level = 'elite';
    }
    return $level;
};

Route::get('/proxy_test_old', function (Request $request) use ($checkAnonymity) {
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
            $server->type = $checkAnonymity();
            $server->is_checked = $server->is_available = $server->was_available = 1;
            $server->ping = $server->ping_sum = microtime(true) - (float)$request->query('start');
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
    }
    echo 'proxy_test::';
    echo json_encode($json);
    echo '::proxy_test';
});

Route::get('/proxy_test_http_online', function (Request $request) use($checkAnonymity) {
    $oldServer = \App\AvailableServer::where('address', '=', $request->query('ip') . ':' . $request->query('port'))->first();
    $json = [];

    if ($oldServer) {
        $oldServer->is_available = 1;
        $oldServer->last_availability = date('Y-m-d H:i:s');
        $oldServer->ping_error -= 1;
        $oldServer->ping_success += 1;
        $oldServer->is_checked_speed = 0;
        $oldServer->type = $checkAnonymity();
        $oldServer->ping = microtime(true) - (float)$request->query('start');
        $oldServer->ping_sum += $oldServer->ping;
        $oldServer->save();

        $json['id'] = $oldServer->id;
        $json['address'] = $oldServer->address;

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
            $oldServer->country = !empty($result['country']) ? $result['country'] : NULL;
            $oldServer->country_code = !empty($result['countryCode']) ? $result['countryCode'] : NULL;
            $oldServer->region_code = !empty($result['region']) ? $result['region'] : NULL;
            $oldServer->region_name = !empty($result['regionName']) ? $result['regionName'] : NULL;
            $oldServer->city = !empty($result['city']) ? $result['city'] : NULL;
            $oldServer->zip = !empty($result['zip']) ? $result['zip'] : NULL;
            $oldServer->lat = !empty($result['lat']) ? $result['lat'] : NULL;
            $oldServer->lon = !empty($result['lon']) ? $result['lon'] : NULL;
            $oldServer->timezone = !empty($result['timezone']) ? $result['timezone'] : NULL;
            $oldServer->isp = !empty($result['isp']) ? $result['isp'] : NULL;
            $oldServer->organization = !empty($result['org']) ? $result['org'] : NULL;
            $oldServer->save();
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
        $server->ping_sum += $server->ping;
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

Route::group(['middleware' => 'secure'], function () {
    Route::get('/', function () {
        return view('welcome');
    });

    Route::any('{path}', function () {
        return view('welcome');
    })->where('path', '[a-z\_\/]+')->name('any');
});