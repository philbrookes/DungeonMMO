var server = module.exports = {};

server.init = function(){
};

mapData = {
    "-2": {"-2": 0, "-1": 1, "0": 1, "1": 0, "2": 0},
    "-1": {"-2": 1, "-1": 0, "0": 1, "1": 0, "2": 1},
    "0":  {"-2": 1, "-1": 1, "0": 1, "1": 1, "2": 1},
    "1":  {"-2": 1, "-1": 0, "0": 1, "1": 0, "2": 1},
    "2":  {"-2": 1, "-1": 1, "0": 0, "1": 0, "2": 1}

};

server.listen = function(){
    var me = this;
    this.app.ws('/' + this.config['listener'], me.onNewConnection);
};

server.onNewConnection = function(socket, request) {
    console.log("New connection!");
    socket.pos = {"x": 0, "y": 0};
    socket.dest = {"x": 0, "y": 0};
    socket.speed = 10;
    socket.on("message",function(data){
        data = JSON.parse(data);
        var cmd = commandFactory(data);
        if (cmd) cmd.execute(socket);
        else{
            console.log("no command found")
        }
    });
};

function commandFactory(cmd){
    switch (cmd.command){
        case "move":
            return cmdHandlerMove(cmd);
        default:
            return
    }
}


function cmdHandlerMove(cmd){
    function  validateMove(move,currentPos){
        return move.x > currentPos.x+1 || move.y < currentPos.pos.x - 1
    }

    function iniateMove(move,thing,speed,cb){
        var int = setInterval(function(){
            thing.pos.x +=1;
            thing.pos.y +=1;
            if (thing.pos.x == move.x && thing.y == move.y){
                clearInterval(int);
                cb();
            }
        },speed);
    }
    return{
        execute:function (thing){
            console.log("moving",thing, "to", cmd.data.x, cmd.data.y);
            if(!validateMove(cmd.data,thing.pos)) {
                //fail
                thing.send({"status":0})
            }
            iniateMove(cmd.data,thing,function done(err){
                if (err){
                    //send error
                }
                thing.send({"status": 1, "data": {"pos": thing.pos, "dest": thing.dest, "speed": thing.speed}});
            });


        }
    }
}



