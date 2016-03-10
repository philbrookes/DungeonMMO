Engine.Physical.Item = function Item(){
    this.pos = new Position(0, 0);
    this.Color = "#bcbcbc"
    this.width = 10;
    this.height = 10;
    this.RenderFunction = Engine.Physical.Item.Render;
}

Engine.Physical.Item.prototype = {
    getColor: function GetColor(){
        return item.Color;
    },
    render: function Render(timeSinceLastRender, context){
        context.fillStyle = this.getColor();
        context.fillRect(-(this.width/2), -(this.height/2), this.width, this.height);
    },
    setSize: function SetSize(width, height){
        this.width = typeof width !== 'undefined' ? width : this.width;
        this.height = typeof height !== 'undefined' ? height : this.height;
    }
}