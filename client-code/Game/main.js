var Game = {
    Char: {},
    Equipment: {},
    Map: {
        Data: {}
    },
    ShowingThrobber: 0,
    rendering: false,
    Player: {},
    Character: {},
    DIRECTIONS: {
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
                Game.Char.Character.Move(Game.Character, Game.DIRECTIONS.NORTH);
                break;
            case 83:
            case 40:
                Game.Char.Character.Move(Game.Character, Game.DIRECTIONS.SOUTH);
                break;
            case 65:
            case 37:
                Game.Char.Character.Move(Game.Character, Game.DIRECTIONS.WEST);
                break;
            case 68:
            case 39:
                Game.Char.Character.Move(Game.Character, Game.DIRECTIONS.EAST);
                break;
            case 32:
                Game.Char.Character.Attack(Game.Character);
                break;
        }
    },

    KeyUp: function KeyUp(event){

    },

    DoRender: function DoRender(){
        if( Game.rendering === true ) {
            Engine.Render.Renderer.Render(Engine.renderer);
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
        /*Game.showThrobber();
        if( Game.Player.characters.length > 0) {
            Game.loadTemplate("character-choose", function (data) {
                $('body').append(data);
                Game.hideThrobber();
                $("#login-form").on('submit', Game.loginSubmit);
            });
        } else {
            Game.loadTemplate("character-create", function(data) {
                $('body').append(data);
                Game.hideThrobber();
                $("#character-create-form").on('submit', Game.characterCreateSubmit);
            });
        }*/
        var scene = Engine.Render.Scene.CreateScene();
        var camera = Engine.Render.Camera.CreateCamera();
        Engine.Render.Scene.SetCamera(scene, camera);

        Game.Character = Game.Char.Character.createNewCharacter();
        Game.Char.Character.SetAction(Game.Character, "stand");
        Game.Char.Character.SetMovementSpeed(Game.Character, 140);
        var x = Engine.Utilities.RNG.GenerateInclusiveInt(-65665, 65665);
        var y = Engine.Utilities.RNG.GenerateInclusiveInt(-65665, 65665);
        x = x - (x % 64);
        y = y - (y % 64);
        Game.Char.Character.Teleport(Game.Character, {X: x, Y: y, Z: 0});
        Engine.Render.Scene.AddRenderItem(scene, Game.Character, Game.LAYERS.PLAYERS);

        Engine.Render.Renderer.SetScene(Engine.renderer, scene);

        Game.updateMap(scene, Game.Character.Pos);

        Game.rendering = true;
        Game.DoRender();
    },

    updateMap: function updateMap(scene, position){
        Game.Map.Data = Game.Map.Generator.GenerateMapRegion(position);

        Engine.Render.Scene.ClearLayer(scene, Game.LAYERS.BACKGROUND);

        for(var x in Game.Map.Data){
            for(var y in Game.Map.Data[x]){
                var item = Game.Map.Data[x][y];
                Engine.Render.Scene.AddRenderItem(scene, item, Game.LAYERS.BACKGROUND);
            }
        }
    },

    characterCreateSubmit: function characterCreateSubmit(event){

    },

    loadTemplate: function(template, callback){
        $.get("/templates/" + template + ".template.html", callback);
    }
};
