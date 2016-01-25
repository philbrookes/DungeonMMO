Scene = function(){
    this.Camera = {};
    this.RenderItems = [];
    this.ClearColor = "#000000";
}

Engine.Render.Scene = {
    CreateScene: function CreateScene(){
      return new Scene();
    },
    AddRenderItem: function AddRenderItem(scene, item){
        if(scene.RenderItems.indexOf(item) === -1){
            scene.RenderItems.push(item);
        }
    },
    ClearRenderItems: function ClearRenderItems(scene){
        scene.RenderItems = [];
    },
    RemoveRenderItem: function RemoveRenderItem(scene, item){
        var index = scene.RenderItems.indexOf(item);
        if(index !== -1){
            scene.RenderItems.splice(index, 1);
        }
    },
    GetRenderItems: function GetRenderItems(scene){
        return scene.RenderItems
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