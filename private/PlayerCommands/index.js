var PlayerCommands = module.exports = function PlayerCommands(player){
    var directions = {
        none: -1,
        north: 0,
        west: 1,
        south: 2,
        east: 3
    };

    function sendUpdate(){
        player.socket.send(JSON.stringify({
            "task": "syncPlayer",
            player: {
                name: player.name,
                pos: player.pos,
                id: player.id,
                moveSpeed: player.moveSpeed,
                action: player.action
            }
        }));
    }

    return {
        setPosition: function setPosition(x, y, z){
            player.position.x = x;
            player.position.y = y;
            player.position.z = z;
            sendUpdate();
        },

        move: function move(direction, players){
            switch (direction) {
                case directions.north:
                    var destination = {"x": player.pos.x, "y": player.pos.y - 1};
                    break;
                case directions.south:
                    var destination = {"x": player.pos.x, "y": player.pos.y + 1};
                    break;
                case directions.east:
                    var destination = {"x": player.pos.x + 1, "y": player.pos.y};
                    break;
                case directions.west:
                    var destination = {"x": player.pos.x - 1, "y": player.pos.y};
                    break;
            }

            player.destination = destination;
            player.socket.send(JSON.stringify(
                {"task": "move", "player": {"destination": player.destination, "moveSpeed": player.moveSpeed, "action": player.action}}
            ));

            this.updateOthers(players);

            var me = this;
            setTimeout(function(){
                player.pos.x = player.destination.x;
                player.pos.y = player.destination.y;
                player.pos.z = player.destination.z;
                player.action = "idle";
                sendUpdate();
                me.updateOthers(players);

                for(var otherPlayerId in players){
                    if(otherPlayerId !== player.id){
                        var otherPlayer = players[otherPlayerId];
                        PlayerCommands(otherPlayer).updateOthers([player]);
                    }
                }
            }, 1000 / player.moveSpeed);
        },

        updateOthers: function updateOthers(players){
            for(playerId in players){
                if(player.id != players[playerId].id){
                    players[playerId].socket.send(
                        JSON.stringify({
                            "task": "updateOther",
                            "data": {
                                "player": {
                                    "id": player.id,
                                    "destination": player.destination,
                                    "moveSpeed": player.moveSpeed,
                                    "action": player.action,
                                    "pos": player.pos
                                }
                            }
                        })
                    );
                }
            }
        },

        disconnect: function disconnect(players){
            player.action = "disconnect";
            this.updateOthers(players);
        }
    }
};