//vendor modules
var mixin = require('merge-descriptors');

//local modules
var proto = require('./lib/player.js');

module.exports = createPlayer;

function createPlayer(socket){
    console.log("New Player!");
    var player = function(){};

    mixin(player, proto, false);

    player.socket = socket;

    player.init();

    return player;
}