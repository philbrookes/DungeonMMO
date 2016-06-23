var playerCommands = require('../PlayerCommands');

module.exports = function playerMoveHandler(command){
    return {
        execute: function execute(player, map){
            map.getData(player.pos, 11, 11, function(data){

                //var line = "  ";
                //for(var x=(player.pos.x-25);x<=(player.pos.x+25);x++){
                //    line += " " + x + ((x + "").length < 2 ? " " : "");
                //}
                //console.log(line);
                //for(var y=(player.pos.y-25);y<=(player.pos.y+25);y++){
                //    var line = ( (y + "").length < 2 ? " " : "") + y;
                //    for(var x=(player.pos.x-25);x<=(player.pos.x+25);x++){
                //        if(x == player.pos.x && y == player.pos.y ){
                //            line += "[X]";
                //        }else if(data[x] && data[x][y]){
                //            line += "[#]";
                //        } else {
                //            line += "[ ]";
                //        }
                //    }
                //    console.log(line);
                //}



                var out = {
                    task: "resyncMap",
                    data: {
                        map: data
                    }
                };
                player.socket.send(JSON.stringify(out));
            });
        }
    };
};