var player = require("../../Player");

var server = module.exports = {};

server.init = function(){
    this.connectedPlayers = [];
};

server.listen = function(){
    var me = this;
    this.app.ws('/' + this.config['listener'], me.onNewConnection);
};

server.onNewConnection = function(socket, request) {
    console.log("New connection!");
    var newPlayer = player(socket);
    newPlayer.init();
};

