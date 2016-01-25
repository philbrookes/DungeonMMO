$(document).ready(function(){
    var canvas = document.getElementById("game-screen");
    Engine.context = canvas.getContext("2d");
    Engine.renderer = Engine.Render.Renderer.CreateRenderer();

    CharacterCreation();

    //var scene = Engine.Render.Scene.CreateScene();
    //var camera = Engine.Render.Camera.CreateCamera(0, 0);
    //var item = Engine.Physical.Item.CreateItem();
    //
    //Engine.Utilities.Position.SetPos(item.Pos, Engine.Utilities.Position.CreatePosition(150, 150));
    //Engine.Render.Scene.SetCamera(scene, camera);
    //Engine.Render.Scene.AddRenderItem(scene, item);
    //
    //Engine.Render.Renderer.SetScene(Engine.renderer, scene);
    //
    //renderTick();
});

function renderTick(){
    Engine.Render.Renderer.Render(Engine.renderer, Engine.context);
    requestAnimationFrame(renderTick);
}

