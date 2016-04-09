//vendor modiles
var express = require('express');
var app = express();
require('express-ws')(app);

//local modules
var server = require('./Server');
config = require('../config/config.json');

app.use('/', express.static('./public_html'));

var game = server(app, config['game-server']);
game.listen();

app.listen(config['web-server']['port']);
