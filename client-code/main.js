$(document).ready(function(){
    var canvas = document.getElementById("game-screen");
    var context = canvas.getContext("2d");
    Engine.renderer = Engine.Render.Renderer.CreateRenderer();
    Engine.Render.Renderer.SetContext(Engine.renderer, context);
    Game.Init(Engine);
});

