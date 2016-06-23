module.exports = function unknownCommandHandler(command){
    var unknownCommand = {
        "status": 0,
        "message": "Unknown command: {{command}}",
        "error": "cmd_unknown"
    };

    function formatError(){
        unknownCommand.message = unknownCommand.message.replace("{{command}}", command.task);
        return JSON.stringify(unknownCommand);
    }

    return {
        execute: function execute(player){
            player.socket.send(formatError());
            console.log("player [" + player.id + "] sent unknown command: " + command.task);
        }
    };
};