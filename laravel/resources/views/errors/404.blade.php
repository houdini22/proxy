<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>ProxyDatabase.net</title>
</head>
<body>
<div id="main"></div>
<?php if (App::environment('local')): ?>
<script src="http://localhost:7770/static/js/bundle.js"></script>
<?php elseif (App::environment('production')): ?>
<script src="<?php echo url('/static/js/bundle.js') ?>"></script>
<?php endif ?>
</body>
</html>
