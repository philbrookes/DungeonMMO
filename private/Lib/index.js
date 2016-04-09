var lib = module.exports = {};

lib.position = require('./position.js');
lib.newPosition = function(x, y, z){
    var pos = new lib.position();
    pos.init(x, y, z);
    return pos;
}