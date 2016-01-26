var Map = function(seed){
    this.seed = seed || Engine.Utilities.RNG.GenerateInclusiveInt(0, 65565);
};

Game.Map.Generator = {
    GenerateMapRegion: function GenerateMapRegion(x1, y1, x2, y2){
        findCorners(x1, y1, x2, y2);
    }
};