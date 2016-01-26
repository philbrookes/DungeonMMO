Item = function Item(){
    this.Pos = new Position(0, 0);
    this.Color = "#bcbcbc"
}

Engine.Physical.Item = {
    CreateItem: function CreateItem(){
        return new Item;
    },
    GetColor: function GetColor(item){
        return item.Color;
    },
    Render: function Render(item, context, timeSinceLastRender){
        context.fillStyle = Engine.Physical.Item.GetColor(item);
        context.fillRect(-10, -10, 20, 20);
    }
}