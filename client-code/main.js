$(document).ready(function(){
    var canvas = document.getElementById("game-screen");
    var context = canvas.getContext("2d");
    Engine.renderer = new Engine.Render.Renderer();
    Engine.renderer.setContext(context);

    console.log("ws://" + location.host + "/game");
    Game.socket = new WebSocket("ws://" + location.host + "/game");
    Game.Init(Engine);
});
