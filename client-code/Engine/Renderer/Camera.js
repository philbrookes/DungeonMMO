Camera = function(x, y){
    this.Pos = Engine.Utilities.Position.CreatePosition(x, y);
}

Engine.Render.Camera = {
    CreateCamera: function(x, y){
        return new Camera(x, y);
    },
    GetPosition: function GetPosition(camera){
        return camera.Pos;
    },
    SetPosition: function SetPosition(camera, position){
        Engine.Utilities.Position.SetPos(Engine.Render.Camera.GetPosition(camera), position);
    }
}