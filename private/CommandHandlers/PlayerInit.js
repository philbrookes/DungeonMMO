var playerCommands = require("../PlayerCommands");

module.exports = function playerInitHandler(command){
    return {
        execute: function execute(player, map, players){
            map.getData(player.pos, 25, 25, function(data){
                var out = {
                    task: "init",
                    data: {
                        player: {
                            name: player.name,
                            pos: player.pos,
                            id: player.id,
                            speed: player.speed,
                            action: player.action
                        },
                        map: data
                    }
                };
                player.socket.send(JSON.stringify(out));
                playerCommands(player).updateOthers(players);

                for(var otherPlayerId in players){
                    if(otherPlayerId !== player.id){
                        var otherPlayer = players[otherPlayerId];
                        playerCommands(otherPlayer).updateOthers([player]);
                    }
                }
            });
        }
    };
};