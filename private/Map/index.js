var async = require("async");
var seedrandom = require('seedrandom');

module.exports = function map(cache, config){
    function realMod(x, y){
        return ((x % y) + y) % y
    }
    function calculateEdges(pos, gridWidth, gridHeight, buffer){
        var ret = {
            "north": false,
            "south": false,
            "east": false,
            "west": false
        };
        xGridOffset = realMod(pos.x, gridWidth);
        yGridOffset = realMod(pos.y, gridHeight);

        if( xGridOffset <= buffer ){
            ret.west = true;
        }

        if( gridWidth - xGridOffset <= buffer ){
            ret.east = true;
        }

        if( yGridOffset <= buffer ){
            ret.north = true;
        }

        if( gridHeight - yGridOffset <= buffer ){
            ret.south = true;
        }

        return ret;
    }
    function generate(pos, gridWidth, gridHeight, buffer, cb){
        var edges = calculateEdges(pos, gridWidth, gridHeight, buffer);

        async.parallel({
                current: function current(cb){
                    loadGrid(getGridCoords(pos.x, pos.y, gridWidth, gridHeight), cb);
                },
                north: function north(cb){
                    if(! edges.north){
                        cb(null, {});
                        return;
                    }
                    loadGrid(getGridCoords(pos.x, pos.y - gridHeight, gridWidth, gridHeight), cb);
                },
                south: function south(cb){
                    if(! edges.south){
                        cb(null, {});
                        return;
                    }
                    loadGrid(getGridCoords(pos.x, pos.y + gridHeight, gridWidth, gridHeight), cb);
                },
                west: function west(cb){
                    if(! edges.west){
                        cb(null, {});
                        return;
                    }
                    loadGrid(getGridCoords(pos.x - gridWidth, pos.y, gridWidth, gridHeight), cb);
                },
                east: function east(cb){
                    if(! edges.east){
                        cb(null, {});
                        return;
                    }
                    loadGrid(getGridCoords(pos.x + gridWidth, pos.y, gridWidth, gridHeight), cb);
                },
                northeast: function northeast(cb){
                    if(! edges.east || ! edges.north){
                        cb(null, {});
                        return;
                    }
                    loadGrid(getGridCoords(pos.x + gridWidth, pos.y - gridWidth, gridWidth, gridHeight), cb);
                },
                southeast: function southeast(cb){
                    if(! edges.east || ! edges.south){
                        cb(null, {});
                        return;
                    }
                    loadGrid(getGridCoords(pos.x + gridWidth, pos.y + gridHeight, gridWidth, gridHeight), cb);
                },
                northwest: function northwest(cb){
                    if(! edges.west || ! edges.north){
                        cb(null, {});
                        return;
                    }
                    loadGrid(getGridCoords(pos.x - gridWidth, pos.y - gridWidth, gridWidth, gridHeight), cb);
                },
                southwest: function southwest(cb){
                    if(! edges.west || ! edges.south){
                        cb(null, {});
                        return;
                    }
                    loadGrid(getGridCoords(pos.x - gridWidth, pos.y + gridWidth, gridWidth, gridHeight), cb);
                }
            },
            function(err, data){
                var grid = {};
                for(var gridId in data) {
                    var gridData = data[gridId];
                    for (var x in gridData) {
                        if(! grid.hasOwnProperty(x)){
                            grid[x] = {};
                        }
                        for (var y in gridData[x]) {
                            grid[x][y] = gridData[x][y];
                        }
                    }
                }
                cb(grid);
            }
        );

    }

    function getGridCoords(x, y, gridWidth, gridHeight){
        //-24 -47 24 24
        //{ x1: -24, x2: 0, y1: -24, y2: 0 }

        x1 = x - realMod(x, gridWidth);
        x2 = x1 + (gridWidth);
        y1 = y - realMod(y, gridHeight);
        y2 = y1 + (gridHeight);

        return {
            "x1": x1,
            "x2": x2,
            "y1": y1,
            "y2": y2
        }
    }

    function loadGrid(coords, cb){
        var x1 = coords.x1;
        var x2 = coords.x2;
        var y1 = coords.y1;
        var y2 = coords.y2;

        var seed = "[x1:" + x1  + "/y1:" + y1 + "]/[x2:" + x2 + "/y2:" + y2 + "]";
        cache.get(seed, function(err, grid){
            if( grid == null ){
                grid = generateGrid(coords);
                cache.set(seed, JSON.stringify(grid), function(){}, config['cache-time']);
            } else {
                grid = JSON.parse(grid.toString());
            }
            cb(null, grid);
        });
    }


    function generateGrid(coords){
        var x1 = coords.x1;
        var x2 = coords.x2;
        var y1 = coords.y1;
        var y2 = coords.y2;

        var seed = "" + x1 + x2 + y1 + y2;

        var rng = seedrandom(seed);

        var bornList = [6,7,8];
        var surviveList = [3,4,5,6,7,8];
        var iterations = 20;

        var tiles = {};
        var newTiles = {};

        for(var x=x1;x<x2;x++){
            tiles[x] = {};
            newTiles[x] = {};
            for(var y=y1;y<y2;y++) {
                tiles[x][y] = 0;
                if (x == x1 || x == x2 || y == y1 || y == y2) {
                    tiles[x][y] = 1;
                    continue;
                }

                if(rng() < 0.50){
                    tiles[x][y] = 1;
                    continue;
                }
            }
        }

        while(iterations-- > 0){
            for(var x=x1;x<x2;x++) {
                for (var y = y1; y < y2; y++) {
                    var liveCondition;

                    if (x == x1 || x == x2-1 || y == y1 || y == y2-1) {
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

        for(var x=x1;x<x2;x++) {
            retTiles[x] = {};
            for (var y = y1; y < y2; y++) {
                if( newTiles[x][y] == 1) {
                    retTiles[x][y] = 1;
                } else {
                    retTiles[x][y] = 0;
                }
            }
        }
        return retTiles;
    }

    return {
        getData: function getData(pos, xBuff, yBuff, cb){
            var startX = pos.x - xBuff;
            var endX = pos.x + xBuff;
            var startY = pos.y - yBuff;
            var endY = pos.y + yBuff;
            generate(pos, config['grid']['size']['x'], config['grid']['size']['y'], config['grid']['buffer'], function(grid){
                var tiles = {};
                for(var x = startX; x<=endX;x++){
                    tiles[x] = {};
                    for(var y = startY; y<=endY;y++){
                        if(grid[x] && grid[x][y] == 1){
                            tiles[x][y] = 1;
                        }
                    }
                }
                cb(tiles);
            });
        }
    }
}