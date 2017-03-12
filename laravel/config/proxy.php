<?php

return array(
    'check_server_url_http' => 'http://195.154.179.219',
    'check_server_url_socks' => 'http://195.154.179.219:8080',
    'test_server_old_http_path' => '/proxy/proxy_test_old',
    'test_server_socks_http_path' => '/proxy/proxy_test_socks',
    'test_server_speed_path' => '/proxy/files/test_file',
	'services' => array(
        array(
            'url' => 'http://best-proxy-list-ips.blogspot.com/',
            'disabled' => FALSE,
            'service_name' => 'BestProxyList'
        ),
        array(
            'url' => 'http://sslproxies24.blogspot.nl/',
            'disabled' => FALSE,
            'service_name' => 'BestProxyList'
        ),
        array(
            'url' => 'http://socksproxylist24.blogspot.com/',
            'disabled' => FALSE,
            'service_name' => 'BestProxyList'
        ),
        array(
            'url' => 'http://vip-socks24.blogspot.com/',
            'disabled' => FALSE,
            'service_name' => 'BestProxyList',
        ),
        array(
            'url' => 'http://sockproxy.blogspot.com/',
            'disabled' => FALSE,
            'service_name' => 'BestProxyList',
        ),
        array(
            'url' => 'http://blogspotproxy.blogspot.com/',
            'disabled' => FALSE,
            'service_name' => 'BestProxyList',
        ),
        array(
            'url' => 'http://freeproxyserverus.blogspot.com/',
            'disabled' => FALSE,
            'service_name' => 'BestProxyList',
        ),
        array(
            'url' => 'http://proxyserverlist-24.blogspot.de/',
            'disabled' => FALSE,
            'service_name' => 'BestProxyList',
        ),
        array(
            'url' => 'https://proxybag.blogspot.de/',
            'disabled' => FALSE,
            'service_name' => 'BestProxyList',
        ),
        array(
            'url' => 'http://www.blackhatworld.com/forums/proxy-lists.103/',
            'disabled' => FALSE,
            'service_name' => 'BlackHatSEO',
            'disable_empty_limit' => TRUE
        )
	)
);
