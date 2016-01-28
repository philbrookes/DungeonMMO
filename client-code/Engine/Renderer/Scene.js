Scene = function(){
    this.Camera = {};
    this.ClearColor = "#000000";
    this.layers = [];
};

Engine.Render.Scene = {
    CreateScene: function CreateScene(){
      return new Scene();
    },
    AddRenderItem: function AddRenderItem(scene, item, layer){
        if(typeof scene.layers[layer] == 'undefined'){
            scene.layers[layer] = {
                RenderItems: []
            }
        }

        var items = scene.layers[layer].RenderItems;

        if(items.indexOf(item) === -1){
            items.push(item);
        }
    },
    ClearLayer: function ClearLayer(scene, layer){
        if(typeof scene.layers[layer] != 'undefined') {
            scene.layers[layer].RenderItems = [];
        }
    },
    RemoveRenderItem: function RemoveRenderItem(scene, item){
        for(var layerIndex in scene.layers) {
            var layer = scene.layers[layerIndex];
            var index = layer.RenderItems.indexOf(item);
            if (index !== -1) {
                layer.RenderItems.splice(index, 1);
            }
        }
    },
    GetRenderItems: function GetRenderItems(scene, layer){
        if( typeof scene.layers[layer] == 'undefined'){
            return [];
        }
        return scene.layers[layer].RenderItems;
    },
    GetLayers: function GetRenderItems(scene){
        return scene.layers;
    },
    SetCamera: function SetCamera(scene, camera){
        scene.Camera = camera;
    },
    GetCamera: function GetCamera(scene){
        return scene.Camera;
    },
    SetClearColor: function SetClearColor(scene, color){
        scene.ClearColor = color;
    },
    GetClearColor: function GetClearColor(scene){
        return scene.ClearColor;
    }
};