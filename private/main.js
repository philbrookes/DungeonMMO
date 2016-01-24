var express = require('express');

config = require('../config/config.json');

//Web server
var app = express();
app.use('/', express.static('./public_html'));
app.listen(config['web-server']['port']);