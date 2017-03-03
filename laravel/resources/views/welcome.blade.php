<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>ProxyAggregator</title>
</head>
<body>
<div id="main"></div>
<?php if (App::environment('local')): ?>
<script src="http://localhost:7770/static/js/bundle.js"></script>
<?php elseif (App::environment('production')): ?>
<script src="/static/js/bundle.js"></script>
<?php endif ?>
</body>
</html>