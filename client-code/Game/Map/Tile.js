Game.Map.Tile = function(imageSrc){
    this.image = new Engine.Utilities.ImageLoader.Load(imageSrc);
    this.imageSrc = imageSrc;
    this.width = 64;
    this.height = 64;
    this.pos = new Engine.Utilities.Position();
};

Game.Map.Tile.CreateTile = function CreateTile(imageSrc){
    var tile = new Game.Map.Tile(imageSrc);
    return tile;
};

Game.Map.Tile.prototype = {
    render: function render(timeElapsed, context){
        if(! this.image.imageReady){
            context.fillStyle = "#333333";
            context.fillRect(-(this.width/2), -(this.height/2), this.width, this.height);
        } else {
            context.drawImage(
                this.image.image,
                -(this.width/2),
                -(this.height/2),
                this.width,
                this.height
            );
        }
    }
}