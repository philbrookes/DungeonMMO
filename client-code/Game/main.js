var Game = {
    Char: {},
    Equipment: {},
    Units: {},
    Map: {
        Data: {}
    },
    ShowingThrobber: 0,
    rendering: false,
    Player: {},
    Character: {},
    DIRECTIONS: {
        NONE: -1,
        NORTH: 0,
        WEST: 1,
        SOUTH: 2,
        EAST: 3
    },
    MAP: {
        TILES: {
            SIZE: {
                X: 64,
                Y: 64
            }
        },
        BUFFER: 12,
        SCALE: 64
    },
    LAYERS: {
        DEEP_BACKGROUND: 0,
        BACKGROUND: 1,
        ITEM_SHADOWS: 2,
        ITEMS: 3,
        EFFECTS: 4,
        MONSTER_SHADOWS: 5,
        MONSTERS: 6,
        PLAYER_SHADOWS: 7,
        PLAYERS: 8,
        WALLS: 9,
        CEILING: 10
    },

    Init: function Init(engine){
        Game.Engine = engine;
        setInterval(Game.Tick, 10);
        Game.showThrobber();
        Game.socket.onopen = function(evt){
            Game.initGame();
        }

        Game.socket.onclose = Game.disconnected;
        Game.socket.onmessage = Game.data;
        Game.socket.onerror = Game.error;


        $("body").keydown(Game.KeyDown);
        $("body").keyup(Game.KeyUp);
    },

    disconnected: function(evt){

    },

    error: function(evt){

    },

    data: function(evt){
        var command = JSON.parse(evt.data);
        console.log(command);
        switch (command.task){
            case "init":
                var scene = new Engine.Render.scene();
                Engine.renderer.setScene(scene);

                var camera = new Engine.Render.Camera(new Engine.Utilities.Position());
                Engine.renderer.getScene().setCamera(camera);

                Game.character = Game.createNewCharacter();
                Game.character.isPlayer = true;
                Game.otherCharacters = {};
                Game.character.setAction("stand");
                Game.character.setMovementSpeed(command.data.player.moveSpeed * Game.MAP.SCALE);
                Game.character.teleport(command.data.player.pos, Game.MAP.SCALE);

                Engine.renderer.getScene().addRenderItem(Game.character, Game.LAYERS.PLAYERS);
                Game.updateMap(command.data.map, Engine.renderer.getScene(), Game.character.pos);

                Game.hideThrobber();
                Game.rendering = true;
                Game.DoRender();
                break;
            case "move":
                Game.character.destination.setPos(command.player.destination, Game.MAP.SCALE);
                console.log(Game.character.destination);
                Game.character.setMovementSpeed(command.player.moveSpeed * Game.MAP.SCALE);
                Game.character.action = command.player.action;
                console.log(Game.character.action);
                break;
            case "syncPlayer":
                Game.character.teleport(command.player.pos, Game.MAP.SCALE);
                Game.character.setMovementSpeed(command.player.moveSpeed * Game.MAP.SCALE);
                Game.character.action = command.player.action;
                Game.resyncMap();
                break;
            case "updateOther":
                var otherPlayer = command.data.player;
                console.log(otherPlayer.action);
                if(otherPlayer.action !== "disconnect" && Game.character.pos.distance(otherPlayer.pos, Game.MAP.SCALE) < Game.MAP.BUFFER * Game.MAP.SCALE){
                    if(Game.otherCharacters[otherPlayer.id] == null) {
                        Game.otherCharacters[otherPlayer.id] = Game.createCharacter();
                        Engine.renderer.getScene().addRenderItem(Game.otherCharacters[otherPlayer.id], Game.LAYERS.PLAYERS);
                    }
                    Game.otherCharacters[otherPlayer.id].pos.setPos(otherPlayer.pos, Game.MAP.SCALE);
                    Game.otherCharacters[otherPlayer.id].destination.setPos(otherPlayer.destination, Game.MAP.SCALE);
                    Game.otherCharacters[otherPlayer.id].action = otherPlayer.action;
                    Game.otherCharacters[otherPlayer.id].setMovementSpeed(otherPlayer.moveSpeed * Game.MAP.SCALE);
                } else {
                    if(Game.otherCharacters[otherPlayer.id] != null) {
                        Engine.renderer.getScene().removeRenderItem(Game.otherCharacters[otherPlayer.id]);
                        delete Game.otherCharacters[otherPlayer.id];
                    }
                }
                break;
            case "resyncMap":
                Game.updateMap(command.data.map, Engine.renderer.getScene(), Game.character.pos);
                break;
        }
    },

    initGame: function initGame(){
        Game.socket.send(JSON.stringify({"task":"init","data":{}}));
    },

    move: function move(direction){
        Game.socket.send(JSON.stringify({"task":"move","data": {"direction": direction}}));
    },

    resyncMap: function resyncMap(){
        Game.socket.send(JSON.stringify({"task":"resyncMap", "data": {}}));
    },

    Tick: function Tick(){

    },

    KeyDown: function KeyDown(event){
        switch (event.keyCode){
            case 87:
            case 38:
                Game.move(Game.DIRECTIONS.NORTH);
                break;
            case 83:
            case 40:
                Game.move(Game.DIRECTIONS.SOUTH);
                break;
            case 65:
            case 37:
                Game.move(Game.DIRECTIONS.WEST);
                break;
            case 68:
            case 39:
                Game.move(Game.DIRECTIONS.EAST);
                break;
            case 32:
                Game.character.attack();
                break;
        }
    },

    KeyUp: function KeyUp(event){

    },

    DoRender: function DoRender(){
        if( Game.rendering === true ) {
            Engine.renderer.render();
            requestAnimationFrame(Game.DoRender);
        }
    },

    showThrobber: function showThrobber() {
        Game.ShowingThrobber = true;
        if ( $("#throbber").length === 0 ) {
            Game.loadTemplate("throbber", function (data) {
                //in case it loaded too slow, check we still need it
                if(Game.ShowingThrobber === true) {
                    $('body').append(data);
                }
            });
        }
    },

    hideThrobber: function hideThrobber() {
        Game.ShowingThrobber = false;
        if ( $("#throbber").length > 0 ) {
            $("#throbber").remove();
        }
    },

    loadLogin: function loadLogin() {
        Game.loadTemplate("login-dialogue", function(data) {
            $('body').append(data);
            Game.hideThrobber();
            $("#login-form").on('submit', Game.loginSubmit);
        });
    },

    loginSubmit: function loginSubmit(event){
        var username = $("#username").val();
        event.preventDefault();
        var playerData = localStorage.getItem("char_" + username);
        if( playerData !== null ){
            Game.Player = JSON.parse(charData);
        }
        $("#login-dialogue").remove();
        Game.loadCharScreen();
    },


    createCharacter: function CreateCharacter() {
        var char = new Game.Character();
        char.gear = Game.Char.GearSet.CreateGearSet();
        return char;
    },

    createNewCharacter: function CreateNewCharacter() {
        char = Game.createCharacter();
        char.gear.addToGearSet(Game.Equipment.Equipment.CreateEquipment("male_body"));
        char.gear.addToGearSet(Game.Equipment.Equipment.CreateEquipment("noob_shoes"));
        char.gear.addToGearSet(Game.Equipment.Equipment.CreateEquipment("noob_pants"));
        char.gear.addToGearSet(Game.Equipment.Equipment.CreateEquipment("noob_vest"));
        char.setMovementSpeed(140);
        return char;
    },


    generateStartingPosition: function generateStartingPosition(){
        Game.updateMap(Engine.renderer.getScene(), {x: 0, y:0, z: 0});
        return new Engine.Utilities.Position(0, 0);
    },

    updateMap: function updateMap(data){
        Engine.renderer.getScene().clearLayer(Game.LAYERS.BACKGROUND);
        var tiles = [];
        for(var x in data){
            if(typeof tiles[x] === 'undefined'){
                tiles[x] = {};
            }
            for(var y in data[x]){
                tiles[x][y] = Game.Map.Generator.createTile({
                    x: x * Game.MAP.TILES.SIZE.X,
                    y: y * Game.MAP.TILES.SIZE.Y
                });
                Engine.renderer.getScene().addRenderItem(tiles[x][y], Game.LAYERS.BACKGROUND);
            }
        }
        Game.Map.Data = tiles;
    },

    characterCreateSubmit: function characterCreateSubmit(event){

    },

    loadTemplate: function(template, callback){
        $.get("/templates/" + template + ".template.html", callback);
    }
};
