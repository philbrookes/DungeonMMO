$(document).ready(function(){
    var canvas = document.getElementById("game-screen");
    var context = canvas.getContext("2d");
    Engine.renderer = new Engine.Render.Renderer();
    Engine.renderer.setContext(context);
    Game.Init(Engine);
});

