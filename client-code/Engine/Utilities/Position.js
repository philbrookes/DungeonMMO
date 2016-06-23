Engine.Utilities.Position = function(x, y, z){
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}

Engine.Utilities.Position.prototype = {
    distance: function distance(pos, scale){
        if( typeof scale === 'undefined'){
            scale = 1;
        }
        var tx = (pos.x * scale) - this.x,
            ty = (pos.y * scale) - this.y,
            tz = ((pos.z ? pos.z : 0) * scale) - this.z;
            return Math.sqrt(tx*tx+ty*ty+tz*tz);
    },
    setPos: function setPos(newPos, scale){
        if( typeof scale === 'undefined'){
            scale = 1;
        }
        this.x = typeof newPos.x !== 'undefined' ? newPos.x * scale : this.x;
        this.y = typeof newPos.y !== 'undefined' ? newPos.y * scale : this.y;
        this.z = typeof newPos.z !== 'undefined' ? newPos.z * scale : this.z;
    },
    moveTowards: function moveTowards(destination, speed, timeElapsed){
        var distance = this.distance(destination);
        if (distance == 0) {
            return false;
        }
        var movement = speed * timeElapsed;
        if (movement > distance) {
            this.setPos(destination);
            return true;
        }

        var tx = destination.x - this.x;
        var ty = destination.y - this.y;
        var velX = (tx / distance) * (speed * timeElapsed);
        var velY = (ty / distance) * (speed * timeElapsed);
        this.setPos({x: this.x + velX, y: this.y + velY});

        if(this.distance(destination) === 0){
            return true;
        }

        return false;
    },

    hasExit: function hasExit(direction){
        tilePos = this.tilePos();
        switch (direction){
            case Game.DIRECTIONS.NORTH:
                return (typeof Game.Map.Data[tilePos.x][tilePos.y - 1] !== 'undefined');
            case Game.DIRECTIONS.SOUTH:
                return (typeof Game.Map.Data[tilePos.x][tilePos.y + 1] !== 'undefined');
            case Game.DIRECTIONS.WEST:
                return (typeof Game.Map.Data[tilePos.x - 1][tilePos.y] !== 'undefined');
            case Game.DIRECTIONS.EAST:
                return (typeof Game.Map.Data[tilePos.x + 1][tilePos.y] !== 'undefined');
            default:
                return false;
        }
    },

    tilePos: function tilePos(){
        var currentTileX = (this.x - (this.x % Game.MAP.TILES.SIZE.X)) / Game.MAP.TILES.SIZE.X;
        var currentTileY = (this.y - (this.y % Game.MAP.TILES.SIZE.Y)) / Game.MAP.TILES.SIZE.Y;

        return {x: currentTileX, y: currentTileY};
    },

    tileOffset: function tileOffset(direction, distance){
        distance = distance || 1;
        tilePos = this.tilePos();
        switch (direction){
            case Game.DIRECTIONS.NORTH:
                return new Engine.Utilities.Position(tilePos.x * Game.MAP.TILES.SIZE.X, (tilePos.y - distance) * Game.MAP.TILES.SIZE.Y);
            case Game.DIRECTIONS.SOUTH:
                return new Engine.Utilities.Position(tilePos.x * Game.MAP.TILES.SIZE.X, (tilePos.y + distance) * Game.MAP.TILES.SIZE.Y);
            case Game.DIRECTIONS.WEST:
                return new Engine.Utilities.Position((tilePos.x - distance) * Game.MAP.TILES.SIZE.X, tilePos.y * Game.MAP.TILES.SIZE.Y);
            case Game.DIRECTIONS.EAST:
                return new Engine.Utilities.Position((tilePos.x + distance) * Game.MAP.TILES.SIZE.X, tilePos.y * Game.MAP.TILES.SIZE.Y);
        }
    },

    invertDirection: function invertDirection(direction){
        switch (direction) {
            case Game.DIRECTIONS.NORTH:
                return Game.DIRECTIONS.SOUTH;
            case Game.DIRECTIONS.SOUTH:
                return Game.DIRECTIONS.NORTH;
            case Game.DIRECTIONS.EAST:
                return Game.DIRECTIONS.WEST;
            case Game.DIRECTIONS.WEST:
                return Game.DIRECTIONS.EAST;
            default:
                return Game.DIRECTIONS.NONE;
        }
    }

}