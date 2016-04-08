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
        GRID: {
            SIZE: {
                X: 30,
                Y: 30
            }
        }
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
        //Game.showThrobber();
        //Game.loadLogin();
        Game.loadCharScreen();
        $("body").keydown(Game.KeyDown);
        $("body").keyup(Game.KeyUp);
    },

    Tick: function Tick(){

    },

    KeyDown: function KeyDown(event){
        switch (event.keyCode){
            case 87:
            case 38:
                Game.character.move(Game.DIRECTIONS.NORTH);
                break;
            case 83:
            case 40:
                Game.character.move(Game.DIRECTIONS.SOUTH);
                break;
            case 65:
            case 37:
                Game.character.move(Game.DIRECTIONS.WEST);
                break;
            case 68:
            case 39:
                Game.character.move(Game.DIRECTIONS.EAST);
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

    loadCharScreen: function loadCharScreen(){
        var scene = new Engine.Render.scene();
        Engine.renderer.setScene(scene);

        var camera = new Engine.Render.Camera(new Engine.Utilities.Position());
        Engine.renderer.getScene().setCamera(camera);

        startPos = Game.generateStartingPosition();

        Game.character = Game.createNewCharacter();
        Game.character.setAction("stand");
        Game.character.setMovementSpeed(128);
        Game.character.teleport(startPos);

        Game.mob = Game.Units.Mob.newMob({pos: startPos, destination: startPos, moveTime: 3});

        Engine.renderer.getScene().addRenderItem(Game.character, Game.LAYERS.PLAYERS);
        Engine.renderer.getScene().addRenderItem(Game.mob, Game.LAYERS.MONSTERS);
        Game.updateMap(Engine.renderer.getScene(), Game.character.pos);

        Game.rendering = true;
        Game.DoRender();
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
        var x = Engine.Utilities.RNG.GenerateInclusiveInt(-65665, 65665);
        var y = Engine.Utilities.RNG.GenerateInclusiveInt(-65665, 65665);

        Game.updateMap(Engine.renderer.getScene(), {x: x*64, y:y*64, z: 0});

        if(typeof Game.Map.Data[x][y] === 'undefined'){
            y = Object.keys(Game.Map.Data[x])[0];
        }

        x = x * 64;
        y = y * 64;

        return new Engine.Utilities.Position(x, y);
    },

    updateMap: function updateMap(scene, position){
        Game.Map.Data = Game.Map.Generator.GenerateMapRegion(position);

        Engine.renderer.getScene().clearLayer(Game.LAYERS.BACKGROUND);

        for(var x in Game.Map.Data){
            for(var y in Game.Map.Data[x]){
                var item = Game.Map.Data[x][y];
                Engine.renderer.getScene().addRenderItem(item, Game.LAYERS.BACKGROUND);
            }
        }
    },

    characterCreateSubmit: function characterCreateSubmit(event){

    },

    loadTemplate: function(template, callback){
        $.get("/templates/" + template + ".template.html", callback);
    }
};
