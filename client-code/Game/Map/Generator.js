Game.Map.Generator = {
    createTile: function createTile(position){
        var tile = Game.Map.Tile.CreateTile(
            "/images/tiles/dc-dngn/floor/cobble_blood" + (Math.abs((position.x * position.y) % 11) + 1) + ".png"
        );
        tile.pos.setPos(position);
        return tile;
    }

};