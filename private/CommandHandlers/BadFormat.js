module.exports = function badFormatHandler(command){
    var badFormat = {
        "status": 0,
        "message": "request is badly formatted",
        "error": "cmd_bad_format"
    };

    return {
        execute: function execute(player){
            player.socket.send(JSON.stringify(badFormat));
            console.log("player [" + player.id + "] sent bad format: " + command);
        }
    };
};