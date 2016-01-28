var Tile = function(imageSrc){
    this.image = new Engine.Utilities.ImageLoader.Load(imageSrc);
    this.imageSrc = imageSrc;
    this.width = 64;
    this.height = 64;
    this.Pos = new Position();
    this.RenderFunction = Game.Map.Tile.Render;
}

Game.Map.Tile = {
    CreateTile: function CreateTile(imageSrc){
        var tile = new Tile(imageSrc);
        return tile;
    },
    Render: function Render(tile, timeElapsed, context){
        if(! tile.image.imageReady){
            context.fillStyle = "#333333";
            context.fillRect(-(tile.width/2), -(tile.height/2), tile.width, tile.height);
        } else {
            context.drawImage(
                tile.image.image,
                -(tile.width/2),
                -(tile.height/2),
                tile.width,
                tile.height
            );
        }
    }
}