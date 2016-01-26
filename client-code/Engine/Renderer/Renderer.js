Renderer = function(){
    this.lastRender = 0;
    this.Scene = {};
    this.Context = {};
}

Engine.Render.Renderer = {
    CreateRenderer: function CreateRenderer(){
        return new Renderer;
    },
    Render: function Render(renderer){
        var scene = Engine.Render.Renderer.GetScene(renderer);
        var camera = Engine.Render.Scene.GetCamera(scene);
        var context = Engine.Render.Renderer.GetContext(renderer);

        Engine.Render.Renderer.clear(scene, context);
        var timeSinceLastRender = Engine.Render.Renderer.GetTimeSinceLastRender(renderer);
        context.save();
        context.translate(camera.Pos.X, camera.Pos.Y);

        var items = Engine.Render.Scene.GetRenderItems(scene);
        for(var index in items) {
            Engine.Render.Renderer.RenderItem(items[index], timeSinceLastRender, context);
        }

        context.restore();
    },

    RenderItem: function RenderItem(item, timeSinceLastRender, context){
        context.save();
        context.translate(item.Pos.X, item.Pos.Y);
        if ( item instanceof Character ){
            Game.Char.Character.Render(item, timeSinceLastRender, context);
        } else if ( item instanceof Item ){
            Engine.Render.Item.Render(item, timeSinceLastRender, context);
        }
        context.restore();
    },

    SetScene: function SetScene(renderer, scene){
        renderer.Scene = scene;
    },

    GetScene: function GetScene(renderer){
        return renderer.Scene;
    },

    SetContext: function SetContext(renderer, context){
        renderer.Context = context;
    },

    GetContext: function GetContext(renderer){
        return renderer.Context;
    },

    GetTimeSinceLastRender: function GetTimeSinceLastRender(renderer){
        var timeElapsed = 0;
        var lastRender = Engine.Render.Renderer.GetLastRender(renderer);

        if(lastRender > 0){
            timeElapsed = (new Date().getTime() - lastRender) / 1000;
        }
        renderer.lastRender = new Date().getTime();

        return timeElapsed;
    },

    GetLastRender: function GetLastRender(renderer){
        return renderer.lastRender;
    },

    clear: function clear(scene, context){
        context.fillStyle = Engine.Render.Scene.GetClearColor(scene);
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }
}
