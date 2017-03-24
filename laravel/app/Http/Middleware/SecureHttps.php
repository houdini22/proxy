<?php

namespace App\Http\Middleware;

use Closure;

class SecureHttps
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (!$request->secure() && env('APP_ENV') === 'production' && $_SERVER['SERVER_PORT'] == 80) {
            //return redirect()->secure($request->getRequestUri());
        }

        return $next($request);
    }
}
