Item = function Item(){
    this.Pos = new Position(0, 0);
    this.Color = "#bcbcbc"
    this.width = 10;
    this.height = 10;
    this.RenderFunction = Engine.Physical.Item.Render;
}

Engine.Physical.Item = {
    CreateItem: function CreateItem(){
        return new Item;
    },
    GetColor: function GetColor(item){
        return item.Color;
    },
    Render: function Render(item, timeSinceLastRender, context){
        context.fillStyle = Engine.Physical.Item.GetColor(item);
        context.fillRect(-(item.width/2), -(item.height/2), item.width, item.height);
    },
    SetSize: function SetSize(item, width, height){
        item.width = typeof width !== 'undefined' ? width : item.width;
        item.height = typeof height !== 'undefined' ? height : item.height;
    }
}