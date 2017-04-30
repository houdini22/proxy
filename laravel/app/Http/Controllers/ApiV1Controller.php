<?php

namespace App\Http\Controllers;

use App\AvailableServer;
use App\Date;
use App\Mail\AccountConfirmed;
use App\Mail\ConfirmAccount;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Intervention\Image\Facades\Image;
use Cartalyst\Sentinel\Laravel\Facades\Sentinel;
use Cartalyst\Sentinel\Laravel\Facades\Activation;

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
            return AvailableServer::where('last_availability', '>', date('Y-m-d H:i:s', time() - Date::DAY))
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
        $response['server_countries'] = Cache::remember('server_countries', $cacheLifetime, function () {
            $servers = AvailableServer::select(\DB::raw('count(*) as count'), 'country')
                ->groupBy('country')
                ->orderBy('country', 'ASC')
                ->whereNotNull('country')
                ->get();
            $result = [];
            foreach ($servers as $s) {
                $result[] = ['country' => $s->country, 'count' => $s->count];
            }
            return $result;
        });
        $response['filter_status_online'] = Cache::remember('filter_status_online', $cacheLifetime, function () {
            return AvailableServer::where('is_available', '=', 1)
                ->count();
        });
        $response['filter_status_offline'] = Cache::remember('filter_status_offline', $cacheLifetime, function () {
            return AvailableServer::where('is_available', '=', 0)
                ->count();
        });

        return JsonResponse::create($response);
    }

    public function getServers(Request $request)
    {
        $servers = AvailableServer::select([
            'address', 'type', 'ping', 'speed', 'no_redirect', 'ping_success', 'ping_error', 'speed_success', 'speed_error',
            'checked_at', 'socks_checked_at', 'speed_checked_at', 'is_socks', 'is_checked_speed', 'last_speed_error_status_code', 'last_speed_error_message',
            'ping_socks_error', 'ping_socks_success', 'is_available', 'ping_sum', 'speed_sum', 'last_availability',
            'country'
        ]);

        $user = Sentinel::getUser();

        switch ($request->query('status', 'online')) {
            case 'online':
                $servers->where('is_available', '=', 1);
                break;

            case 'offline':
                $servers->where('is_available', '=', 0);
                break;
        }

        $type = $request->get('type', []);
        $servers->where(function ($q) use ($type, $user) {
            if (in_array('http_elite', $type)) {
                $q->orWhere(function ($q2) {
                    $q2->where('is_socks', '=', 0)
                        ->where('type', '=', 'elite');
                });
            }
            if (in_array('http_transparent', $type)) {
                $q->orWhere(function ($q2) {
                    $q2->where('is_socks', '=', 0)
                        ->where('type', '=', 'transparent');
                });
            }
            if (in_array('socks5_elite', $type)) {
                $q->orWhere('is_socks', '=', 1);
            }
        });

        if (!!$user AND $user->hasAccess('server.filter_all')) {

            $latency = $request->get('latency', []);

            $servers->where(function ($q) use ($latency, $user) {
                $averageLatencyQuery = \DB::raw('ping_sum / IF(is_socks = 1, ping_socks_success, ping_success)');

                if (in_array('fastest', $latency)) {
                    $q->orWhere(function ($q2) use ($averageLatencyQuery) {
                        $q2->where($averageLatencyQuery, '<', 3);
                    });
                }
                if (in_array('fast', $latency)) {
                    $q->orWhere(function ($q2) use ($averageLatencyQuery) {
                        $q2->where($averageLatencyQuery, '>=', 3)
                            ->where($averageLatencyQuery, '<', 10);
                    });
                }
                if (in_array('medium', $latency)) {
                    $q->orWhere(function ($q2) use ($averageLatencyQuery) {
                        $q2->where($averageLatencyQuery, '>=', 10)
                            ->where($averageLatencyQuery, '<', 25);
                    });
                }
                if (in_array('slow', $latency)) {
                    $q->orWhere(function ($q2) use ($averageLatencyQuery) {
                        $q2->where($averageLatencyQuery, '>=', 25);
                    });
                }
            });

            $speed = $request->get('speed', []);

            $servers->where(function ($q) use ($speed) {
                $averageSpeedQuery = \DB::raw('speed_sum / speed_success');

                if (in_array('fastest', $speed)) {
                    $q->orWhere(function ($q2) use ($averageSpeedQuery) {
                        $q2->where($averageSpeedQuery, '>=', 25600);
                    });
                }
                if (in_array('fast', $speed)) {
                    $q->orWhere(function ($q2) use ($averageSpeedQuery) {
                        $q2->where($averageSpeedQuery, '>=', 10240)
                            ->where($averageSpeedQuery, '<', 25600);
                    });
                }
                if (in_array('medium', $speed)) {
                    $q->orWhere(function ($q2) use ($averageSpeedQuery) {
                        $q2->where($averageSpeedQuery, '>=', 2048)
                            ->where($averageSpeedQuery, '<', 10240);
                    });
                }
                if (in_array('slow', $speed)) {
                    $q->orWhere(function ($q2) use ($averageSpeedQuery) {
                        $q2->where($averageSpeedQuery, '<', 2048)
                            ->orWhereNull($averageSpeedQuery);
                    });
                }
            });

            $uptimeRatioQuery = \DB::raw('(IF(is_socks=0, ping_success + speed_success, ping_socks_success + speed_success) / IF(is_socks = 0, ping_error + speed_error, ping_socks_error + speed_error))');
            $uptimeRatio = $request->get('uptime', []);

            $servers->where(function ($q) use ($uptimeRatio, $uptimeRatioQuery) {
                if (in_array('greatest', $uptimeRatio)) {
                    $q->orWhere(function ($q2) use ($uptimeRatioQuery) {
                        $q2->where($uptimeRatioQuery, '>=', 1)
                            ->orWhere($uptimeRatioQuery, '=', NULL);
                    });
                }
                if (in_array('great', $uptimeRatio)) {
                    $q->orWhere(function ($q2) use ($uptimeRatioQuery) {
                        $q2->where($uptimeRatioQuery, '<', 1)
                            ->where($uptimeRatioQuery, '>=', 0.66);
                    });
                }
                if (in_array('medium', $uptimeRatio)) {
                    $q->orWhere(function ($q2) use ($uptimeRatioQuery) {
                        $q2->where($uptimeRatioQuery, '<', 0.66)
                            ->where($uptimeRatioQuery, '>=', 0.33);
                    });
                }
                if (in_array('low', $uptimeRatio)) {
                    $q->orWhere(function ($q2) use ($uptimeRatioQuery) {
                        $q2->where($uptimeRatioQuery, '<', 0.33);
                    });
                }
            });

            $country = $request->query('country');
            if ($country) {
                $servers->where('country', '=', $country);
            }
        }

        $servers->orderBy('last_availability', 'DESC');

        $limit = 15;
        $per_page = 15;
        $current_page = (int)$request->get('page', 1);

        if (!!$user AND $user->hasAccess('server.no_pages_limit')) {
            $last_page = ceil($servers->get()->count() / $per_page);
            $result = $servers->limit($limit)->offset(($current_page * $limit) - $per_page)->get();
        } else {
            $last_page = 2;
            if ($current_page > $last_page) {
                $current_page = $last_page;
            }
            $result = $servers->limit($limit)->offset(($current_page * $limit) - $per_page)->get();
        }

        $response = [
            'current_page' => $current_page,
            'last_page' => $last_page,
            'total' => $limit * $last_page,
            'data' => $result->toArray()
        ];

        foreach ($response['data'] as & $server) {
            $server['address_img_url'] = url('/api/v1/address/' . md5($server['address'] . $this->_token));
            $server['checked_at'] = \App\Date::fuzzy_span(strtotime($server['checked_at']));
            $server['socks_checked_at'] = \App\Date::fuzzy_span(strtotime($server['socks_checked_at']));
            $server['speed_checked_at'] = $server['speed_checked_at'] !== NULL ? \App\Date::fuzzy_span(strtotime($server['speed_checked_at'])) : NULL;
            $server['last_availability'] = floor((time() - strtotime($server['last_availability'])) / Date::DAY);
            if ($server['is_socks'] === 1) {
                $server['average_ping'] = ($server['ping_socks_success'] > 0) ? round($server['ping_sum'] / $server['ping_socks_success'], 2) : NULL;
                $server['uptime_ratio'] = ($server['ping_socks_success'] + $server['speed_success']) . '/' . ($server['ping_socks_error'] + $server['speed_error']);
            } else {
                $server['average_ping'] = ($server['ping_success'] > 0) ? round($server['ping_sum'] / $server['ping_success'], 2) : NULL;
                $server['uptime_ratio'] = ($server['ping_success'] + $server['speed_success']) . '/' . ($server['ping_error'] + $server['speed_error']);
            }
            $server['average_speed'] = ($server['speed_success'] > 0) ? $server['speed_sum'] / $server['speed_success'] : NULL;
            $server['ping_sum'] = (float)$server['ping_sum'];
            unset($server['address']);
        }

        return JsonResponse::create($response);
    }

    /*public function getAddress(Request $request)
    {
        $token = $request->route('token');
        $server = AvailableServer::where(\DB::raw('md5(CONCAT(address, "' . $this->_token . '"))'), $token)->first();

        if ($server) {
            $pathDisk = base_path() . '/../public/files/addresses/' . $token . '.png';
            if (!file_exists($pathDisk)) {
                $im = imagecreatetruecolor(160, 23);

                $background_color = imagecolorallocate($im, 255, 255, 255);
                imagefill($im, 0, 0, $background_color);

                for ($i = 0; $i < 5; $i++) {
                    $line_color = imagecolorallocate($im, rand(100, 255), rand(100, 255), rand(100, 255));
                    imageline($im, 0, rand() % 23, 160, rand() % 23, $line_color);
                }

                for ($i = 0; $i < 700; $i++) {
                    $pixel_color = imagecolorallocate($im, rand(100, 255), rand(100, 255), rand(100, 255));
                    imagesetpixel($im, rand() % 160, rand() % 23, $pixel_color);
                }

                $text_color = imagecolorallocate($im, 0, 0, 0);
                imagestring($im, 3, 5, 5, $server->address, $text_color);

                imagepng($im, $pathDisk);
            }
            return response()->file($pathDisk);
        } else {
            dd($server);
        }
    }*/

    public function getAddress(Request $request)
    {
        $token = $request->route('token');
        $server = AvailableServer::where(\DB::raw('md5(CONCAT(address, "' . $this->_token . '"))'), $token)->first();

        if ($server) {
            $pathDisk = base_path() . '/../public/files/addresses/' . $token . '.png';
            if (!file_exists($pathDisk)) {
                $img = Image::canvas(160, 33, [0, 0, 0, 0]);

                for ($i = 0; $i < 5; $i++) {
                    $img->line(0, rand() % 33, 160, rand() % 33, function ($draw) {
                        $draw->color([rand(100, 255), rand(100, 255), rand(100, 255), 25]);
                    });
                }

                for ($i = 0; $i < 700; $i++) {
                    $img->pixel([rand(100, 255), rand(100, 255), rand(100, 255), 25], rand() % 160, rand() % 33);
                }

                $img->text($server->address, 80, 16, function ($font) {
                    $font->file(base_path('/resources/fonts/Consolas Bold.ttf'));
                    $font->size(13);
                    $font->color('#3e3f3a');
                    $font->align('center');
                    $font->valign('middle');
                    $font->angle(rand(-8, 8));
                });

                $img->save($pathDisk);
            }
            return response()->file($pathDisk);
        }
    }

    public function postRegister(Request $request)
    {
        $rules = [
            'email' => 'required|email|unique:users,email',
            'email_repeat' => 'required|same:email',
            'password' => 'required',
            'password_repeat' => 'required|same:password',
            'captcha' => 'required|captcha'
        ];
        $this->validate($request, $rules, [
            'captcha' => 'Captcha code is incorrect.'
        ]);

        $credentials = [
            'email' => $request->get('email'),
            'password' => $request->get('password'),
        ];

        $user = Sentinel::register($credentials);
        $user->newsletter = (bool)$request->get('newsletter', false);
        $user->token = str_random(32);
        $user->permissions = [
            'table.auto_refresh' => TRUE
        ];
        $user->save();

        $activation = Activation::create($user);

        Mail::to($user->email)->send(new ConfirmAccount($activation->getCode(), $user->token));

        $response = [
            'message' => 'ok'
        ];

        return JsonResponse::create($response);
    }

    public function getConfirmAccount(Request $request)
    {
        $user = \App\User::where('token', '=', $request->route('token', 'a'))->first();
        if ($user) {
            $user = Sentinel::findById($user->id);
            if ($user) {
                if (Activation::complete($user, $request->route('code', 'b'))) {
                    Mail::to($user->email)->send(new AccountConfirmed());
                    return redirect()->to('/account?' . \http_build_query([
                            'confirmed' => 1,
                            'email' => $user->email
                        ]));
                } else {
                    return redirect()->to('/account?' . \http_build_query([
                            'confirmed' => 0
                        ]));
                }
            }
        }
        return redirect('/error');
    }

    public function postLogin(Request $request)
    {
        $credentials = [
            'email' => $request->get('email'),
            'password' => $request->get('password'),
        ];

        $remember = $request->get('remember') === "1";

        $user = NULL;

        try {
            $user = Sentinel::authenticate($credentials, $remember);
        } catch (\Cartalyst\Sentinel\Checkpoints\ThrottlingException $ex) {
            return JsonResponse::create([
                '_message' => 'Too many attempts.'
            ], 403);
        } catch (\Cartalyst\Sentinel\Checkpoints\NotActivatedException $ex) {
            return JsonResponse::create([
                '_message' => 'Please activate your account before trying to log in.'
            ], 403);
        }

        if ($user) {
            if (Sentinel::login($user)) {
                $ar = $user->toArray();
                $ar['created_at'] = date('F Y', strtotime($ar['created_at']));
                return JsonResponse::create([
                    'isLoggedIn' => TRUE,
                    'user' => $ar
                ]);
            }
        }
        return JsonResponse::create([
            '_message' => 'Wrong credentials.'
        ], 403);
    }

    public function getLogout(Request $request)
    {
        Sentinel::logout();
        return JsonResponse::create([
            '_message' => 'ok'
        ]);
    }

    public function postImport(Request $request)
    {
        $user = Sentinel::getUser();
        $hasPermission = FALSE;
        if (!!$user AND $user->hasAccess('server.import')) {
            $hasPermission = TRUE;
        }
        if (!$hasPermission) {
            return abort(403);
        }

        $html = $request->get('import_text', '');
        $count = 0;
        preg_match_all('/(\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b):(\d+)/', $html, $matches, PREG_SET_ORDER);
        foreach ($matches as $match) {
            $server = new \App\Server;
            $server->address = $match[0];
            $server->ip = $match[1];
            $server->port = $match[2];
            $server->source = 'import';
            try {
                $server->save();
                $count++;
            } catch (\Exception $ex) {

            }
        }

        return JsonResponse::create([
            'count' => $count
        ]);
    }

    public function getSession(Request $request)
    {
        $response = [
            'isLoggedIn' => FALSE,
            'user' => [
                'permissions' => new \stdClass()
            ]
        ];

        $user = Sentinel::getUser();
        if (!!$user) {
            $response['isLoggedIn'] = TRUE;
            $response['user'] = $user->toArray();
            $response['user']['created_at'] = date('F Y', strtotime($user->created_at));
        }

        return JsonResponse::create($response);
    }
}
