//vendor modules
var mixin = require('merge-descriptors');

//local modules
var proto = require('./lib/server.js');

module.exports = createServer;

function createServer(app, config){
    var server = function(){};

    server.app = app;
    server.config = config;

    mixin(server, proto, false);

    server.init();

    return server;
}