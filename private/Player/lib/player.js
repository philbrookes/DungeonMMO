var lib = require("../../Lib");

var player = module.exports = {};

player.init = function(){
    console.log("Player init!");
    var me = this;
    this.name = "UNNAMED";
    this.position = lib.newPosition();
    this.socket.on('message', me.onMessage);
};

player.onMessage = function(msg) {
    console.log("player " + this.name + " sent: " + msg);
    this.socket.send(msg);
};

