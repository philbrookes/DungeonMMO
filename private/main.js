//vendor modules
var express = require('express');
var app = express();
var memjs = require('memjs');
require('express-ws')(app);

//local modules
var cmdFactory = require('./CommandHandlers');
var mapFactory = require('./Map');
var playerCommands = require('./PlayerCommands');
var config = require('../config/config.json');

var cache = memjs.Client.create(config['game-server']['memcached']['host'] + ':' + config['game-server']['memcached']['port']);
var map = mapFactory(cache, config['game-server']['map']);

app.use('/', express.static('./public_html'));
var connectedPlayers = [];
var playerIdCount = 1;
app.ws('/' + config['game-server']['listener'], function(socket, request) {

    var player = {};
    player.socket = socket;
    player.name = "NONAME#" + player.id;
    player.pos = {"x": 0, "y": 0, "z": 0};
    player.destination = {"x": 0, "y": 0, "z": 0};
    player.moveSpeed = 2;
    player.action = "idle";
    player.id = playerIdCount++;

    connectedPlayers.push(player);
    socket.on('message', function(msg) {
        cmdFactory(msg).getHandler().execute(player, map, connectedPlayers);
    });
    socket.on('close', function(){
        if(connectedPlayers.indexOf(player) > -1){
            connectedPlayers.splice(connectedPlayers.indexOf(player), 1);
        }
        playerCommands(player).disconnect(connectedPlayers);
    });
});

app.listen(config['web-server']['port']);
