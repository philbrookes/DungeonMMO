Game.Map.Generator = {
    GenerateMapRegion: function GenerateMapRegion(center, width, height){
        var centerTileX = (center.x - (center.x % Game.MAP.TILES.SIZE.X)) / Game.MAP.TILES.SIZE.X;
        var centerTileY = (center.y - (center.y % Game.MAP.TILES.SIZE.Y)) / Game.MAP.TILES.SIZE.Y;

        $("#debug_info").text("X: " + centerTileX + ", Y:" + centerTileY);

        var gridOffsetX = Math.floor(centerTileX / Game.MAP.GRID.SIZE.X);
        var gridOffsetY = Math.floor(centerTileY / Game.MAP.GRID.SIZE.Y);

        var grids = [];

        var nearNorth = false;
        var nearSouth = false;
        var nearWest = false;
        var nearEast = false;

        var thisGridCoords = {
            name: "This Grid",
            X1: (gridOffsetX * Game.MAP.GRID.SIZE.X),
            Y1: (gridOffsetY * Game.MAP.GRID.SIZE.Y),
            X2: (gridOffsetX * Game.MAP.GRID.SIZE.X) + (Game.MAP.GRID.SIZE.X),
            Y2: (gridOffsetY * Game.MAP.GRID.SIZE.Y) + (Game.MAP.GRID.SIZE.Y),
            color: "#ffffff"
        };

        grids.push(thisGridCoords);

        var gridCoords = {};

        var buffer_size = 12;

        if ( Math.abs(centerTileX - thisGridCoords.X1) < buffer_size ){
            //also build region to the west
            var nearWest = true;
            gridCoords = {
                name: "west",
                X1: thisGridCoords.X1,
                Y1: thisGridCoords.Y1,
                X2: thisGridCoords.X2,
                Y2: thisGridCoords.Y2,
                color: "#bbbbbb"
            };
            Game.Map.Generator.shiftGridWest(gridCoords);
            grids.push(gridCoords);
        }

        else if ( Math.abs(thisGridCoords.X2 - centerTileX) < buffer_size ){
            //also build region to the east
            var nearEast = true;
            gridCoords = {
                name: "east",
                X1: thisGridCoords.X1,
                Y1: thisGridCoords.Y1,
                X2: thisGridCoords.X2,
                Y2: thisGridCoords.Y2,
                color: "#bbbb33"
            };
            Game.Map.Generator.shiftGridEast(gridCoords);
            grids.push(gridCoords);
        }

        if ( Math.abs(thisGridCoords.Y1 - centerTileY) < buffer_size ){
            //also build region to the north
            var nearNorth = true;
            gridCoords = {
                name: "north",
                X1: thisGridCoords.X1,
                Y1: thisGridCoords.Y1,
                X2: thisGridCoords.X2,
                Y2: thisGridCoords.Y2,
                color: "#777777"
            };
            Game.Map.Generator.shiftGridNorth(gridCoords);
            grids.push(gridCoords);
        }

        else if ( Math.abs(centerTileY - thisGridCoords.Y2) < buffer_size ){
            //also build region to the south
            var nearSouth = true;
            gridCoords = {
                name: "south",
                X1: thisGridCoords.X1,
                Y1: thisGridCoords.Y1,
                X2: thisGridCoords.X2,
                Y2: thisGridCoords.Y2,
                color: "#bbbb33"
            };
            Game.Map.Generator.shiftGridSouth(gridCoords);
            grids.push(gridCoords);
        }

        if ( nearNorth && nearWest ){
            //also build northwest grid
            gridCoords = {
                name: "northwest",
                X1: thisGridCoords.X1,
                Y1: thisGridCoords.Y1,
                X2: thisGridCoords.X2,
                Y2: thisGridCoords.Y2,
                color: "#333333"
            };
            Game.Map.Generator.shiftGridNorth(gridCoords);
            Game.Map.Generator.shiftGridWest(gridCoords);
            grids.push(gridCoords);
        }

        else if (nearNorth && nearEast){
            //also build northeast grid
            gridCoords = {
                name: "northeast",
                X1: thisGridCoords.X1,
                Y1: thisGridCoords.Y1,
                X2: thisGridCoords.X2,
                Y2: thisGridCoords.Y2,
                color: "#bbbb33"
            };
            Game.Map.Generator.shiftGridNorth(gridCoords);
            Game.Map.Generator.shiftGridEast(gridCoords);
            grids.push(gridCoords);
        }

        else if ( nearSouth && nearWest ){
            //also build southwest grid
            gridCoords = {
                name: "southwest",
                X1: thisGridCoords.X1,
                Y1: thisGridCoords.Y1,
                X2: thisGridCoords.X2,
                Y2: thisGridCoords.Y2,
                color: "#bbbb33"
            };
            Game.Map.Generator.shiftGridSouth(gridCoords);
            Game.Map.Generator.shiftGridWest(gridCoords);
            grids.push(gridCoords);
        }

        else if (nearSouth && nearEast){
            //also build southeast grid
            gridCoords = {
                name: "southeast",
                X1: thisGridCoords.X1,
                Y1: thisGridCoords.Y1,
                X2: thisGridCoords.X2,
                Y2: thisGridCoords.Y2,
                color: "#bbbb33"
            };
            Game.Map.Generator.shiftGridSouth(gridCoords);
            Game.Map.Generator.shiftGridEast(gridCoords);
            grids.push(gridCoords);
        }

        var tiles = [];

        for(var gridIndex in grids){
            var gridTiles = Game.Map.Generator.GenerateGrid(grids[gridIndex]);
            for(var x = centerTileX-buffer_size;x<centerTileX+buffer_size;x++){
                if(typeof tiles[x] === 'undefined'){
                    tiles[x] = {};
                }
                for(var y = centerTileY - buffer_size;y<centerTileY + buffer_size;y++){
                    if(gridTiles[x] && gridTiles[x][y]){
                        tiles[x][y] = Game.Map.Generator.createTile({
                            x: x * Game.MAP.TILES.SIZE.X,
                            y: y * Game.MAP.TILES.SIZE.Y
                        });
                    }
                }
            }
        }

        return tiles;
    },

    GenerateGrid: function GenerateGrid(grid){
        var seed = "" + grid.X1 + grid.X2 + grid.Y1 + grid.Y2;
        var cached = localStorage.getItem("grid_" + seed);
        if(cached !== null){
            cached = JSON.parse(cached);
            for(var i in cached){
                cached[i].image = new Engine.Utilities.ImageLoader.Load(cached[i].imageSrc);
                cached[i].RenderFunction = Game.Map.Tile.Render;
            }
            return cached;
        }
        var rng = new Math.seedrandom(seed);


        var bornList = [6,7,8];
        var surviveList = [3,4,5,6,7,8];
        var iterations = 20;

        var tiles = {};
        var newTiles = {};

        for(var x=grid.X1;x<=grid.X2;x++){
            tiles[x] = {};
            newTiles[x] = {};
            for(var y=grid.Y1;y<=grid.Y2;y++) {
                tiles[x][y] = 0;
                if (x == grid.X1 || x == grid.X2 || y == grid.Y1 || y == grid.Y2) {
                    tiles[x][y] = 1;
                    continue;
                }

                if(rng.quick() < 0.50){
                    tiles[x][y] = 1;
                    continue;
                }
            }
        }

        while(iterations-- > 0){
            for(var x=grid.X1;x<=grid.X2;x++) {
                for (var y = grid.Y1; y <= grid.Y2; y++) {
                    var liveCondition;

                    if (x == grid.X1 || x == grid.X2 || y == grid.Y1 || y == grid.Y2) {
                        liveCondition = true;
                    } else {
                        var nbhd = 0;

                        nbhd += tiles[x - 1][y - 1];
                        nbhd += tiles[x - 1][y];
                        nbhd += tiles[x - 1][y + 1];
                        nbhd += tiles[x][y - 1];
                        nbhd += tiles[x][y + 1];
                        nbhd += tiles[x + 1][y - 1];
                        nbhd += tiles[x + 1][y];
                        nbhd += tiles[x + 1][y + 1];

                        // apply B678/S345678
                        var currentState = tiles[x][y];
                        var liveCondition =
                            (currentState == 0 && bornList.indexOf(nbhd) > -1) ||
                            (currentState == 1 && surviveList.indexOf(nbhd) > -1);
                    }

                    newTiles[x][y] = liveCondition ? 1 : 0;
                }
            }
        }

        var retTiles = {};

        for(var x=grid.X1;x<=grid.X2;x++) {
            retTiles[x] = {};
            for (var y = grid.Y1; y <= grid.Y2; y++) {
                if( newTiles[x][y] == 1) {
                    retTiles[x][y] = 1;
                }
            }
        }
        localStorage.setItem("grid_" + seed, JSON.stringify(retTiles));
        return retTiles;
    },

    shiftGridEast: function shiftGridEast(grid){
        grid.X1 = grid.X2;
        grid.X2 = grid.X2 + (Game.MAP.GRID.SIZE.X);
    },
    shiftGridWest: function shiftGridWest(grid){
        grid.X2 = grid.X1;
        grid.X1 = grid.X1 - (Game.MAP.GRID.SIZE.X);
    },
    shiftGridNorth: function shiftGridNorth(grid){
        grid.Y2 = grid.Y1;
        grid.Y1 = grid.Y1 - (Game.MAP.GRID.SIZE.Y);
    },
    shiftGridSouth: function shiftGridSouth(grid){
        grid.Y1 = grid.Y2;
        grid.Y2 = grid.Y2 + (Game.MAP.GRID.SIZE.Y);
    },

    createTile: function createTile(position){
        var tile = Game.Map.Tile.CreateTile(
            "/images/tiles/dc-dngn/floor/cobble_blood" + (Math.abs((position.x * position.y) % 11) + 1) + ".png"
        );
        tile.pos.setPos(position);
        return tile;
    }

};