var Game = {
    Char: {},
    Equipment: {},
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
        }
    },

    Init: function Init(engine){
        Game.Engine = engine;
        setInterval(Game.Tick, 10);
        Game.showThrobber();
        Game.loadLogin();
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
        Game.Character = Game.Char.Character.createNewCharacter();
        Game.Char.Character.SetAction(Game.Character, "stand");
        Game.Char.Character.Teleport(Game.Character, {X: 150, Y: 150, Z: 0});
        var scene = Engine.Render.Scene.CreateScene();
        var camera = Engine.Render.Camera.CreateCamera();
        Engine.Render.Scene.SetCamera(scene, camera);
        Engine.Render.Scene.AddRenderItem(scene, Game.Character);
        Engine.Render.Renderer.SetScene(Engine.renderer, scene);
        Game.rendering = true;
        Game.DoRender();
    },

    characterCreateSubmit: function characterCreateSubmit(event){

    },

    loadTemplate: function(template, callback){
        $.get("/templates/" + template + ".template.html", callback);
    }
};
