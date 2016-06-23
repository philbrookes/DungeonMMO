var unknownHandler   = require("./Unknown.js");
var badFormatHandler = require("./BadFormat.js");
var playerInitHandler = require("./PlayerInit.js");
var playerMoveHandler = require("./PlayerMove.js");
var playerMapSyncHandler = require("./PlayerMapSync.js");


module.exports = function commandFactory(command){
    var badJson = false;
    try {
        command = JSON.parse(command);
    } catch (e) {
        badJson = true;
    }

    function valid(){
        return (
            ! badJson
            && command.hasOwnProperty("task")
        );
    }

    return {
        getHandler: function getHandler(){
            if(! valid()){
                return badFormatHandler(command);
            }
            switch(command.task){
                case "init":
                    return playerInitHandler(command);
                    break;
                case "move":
                    return playerMoveHandler(command);
                    break;
                case "resyncMap":
                    return playerMapSyncHandler(command);
                    break;
                default:
                    return unknownHandler(command);
            }
        }
    };
};