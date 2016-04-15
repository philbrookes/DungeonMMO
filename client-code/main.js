$(document).ready(function(){
    var canvas = document.getElementById("game-screen");
    var context = canvas.getContext("2d");
    Engine.renderer = new Engine.Render.Renderer();
    Engine.renderer.setContext(context);
    Game.Init(Engine);

    websocket = new WebSocket("ws://localhost:3000/ws");


    websocket.onopen = function(evt) {
        //websocket.send({"command":"move","data":{}})
        console.log(evt);
    };
    websocket.onclose = function(evt) { console.log(evt); };
    websocket.onmessage = function(evt) { console.log(evt); };
    websocket.onerror = function(evt) { console.log(evt); };
});

