Engine.Render.Renderer = function(){
    this.lastRender = 0;
    this.scene = {};
    this.context = {};
}

Engine.Render.Renderer.prototype = {
    render: function Render(){
        var scene = this.getScene();
        var camera = scene.getCamera();
        var context = this.context;

        this.clear();
        var timeSinceLastRender = this.getTimeSinceLastRender();
        context.save();
        context.translate(-camera.pos.x + (context.canvas.width/2), -camera.pos.y + (context.canvas.height/2));

        var layers = scene.getLayers();
        for(var index in layers) {
            for(var itemIndex in layers[index].RenderItems) {
                this.renderItem(layers[index].RenderItems[itemIndex], timeSinceLastRender, context);
            }
        }

        context.restore();
    },

    renderItem: function RenderItem(item, timeSinceLastRender, context){
        context.save();
        context.translate(item.pos.x, item.pos.y);
        if(typeof item.render === 'function'){
            item.render(timeSinceLastRender, context);
        }
        context.restore();
    },

    setScene: function SetScene(scene){
        this.scene = scene;
    },

    getScene: function GetScene(){
        return this.scene;
    },

    setContext: function SetContext(context){
        this.context = context;
    },

    getContext: function getContext(){
        return this.context;
    },

    getTimeSinceLastRender: function GetTimeSinceLastRender(){
        var timeElapsed = 0;
        var lastRender = this.getLastRender();

        if(lastRender > 0){
            timeElapsed = (new Date().getTime() - lastRender) / 1000;
        }
        this.lastRender = new Date().getTime();

        return timeElapsed;
    },

    getLastRender: function GetLastRender(){
        return this.lastRender;
    },

    clear: function clear(){
        this.context.fillStyle = this.scene.getClearColor();
        this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    }
}
