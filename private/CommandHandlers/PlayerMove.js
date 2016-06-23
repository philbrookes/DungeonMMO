var playerCommands = require('../PlayerCommands');

module.exports = function playerMoveHandler(command){
    var directions = {
        none: -1,
        north: 0,
        west: 1,
        south: 2,
        east: 3
    };

    function checkExit(player, direction, data){
        switch (direction){
            case directions.north:
                return (typeof data[player.pos.x][player.pos.y - 1] !== 'undefined');
            case directions.south:
                return (typeof data[player.pos.x][player.pos.y + 1] !== 'undefined');
            case directions.west:
                return (typeof data[player.pos.x - 1][player.pos.y] !== 'undefined');
            case directions.east:
                return (typeof data[player.pos.x + 1][player.pos.y] !== 'undefined');
            default:
                return false;
        }
    }

    return {
        execute: function execute(player, map, players){
            if(player.action === "idle") {
                map.getData(player.pos, 25, 25, function (data) {
                    if (checkExit(player, command.data.direction, data)) {
                        playerCommands(player).move(command.data.direction, players);
                    }
                });
            }
        }
    };
};