Engine.Utilities.Position = function(x, y, z){
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}

Engine.Utilities.Position.prototype = {
    distance: function distance(pos){
        var tx = pos.x - this.x,
            ty = pos.y - this.y,
            tz = pos.z - this.z;
            return Math.sqrt(tx*tx+ty*ty+tz*tz);
    },
    setPos: function SetPos(newPos){
        this.x = typeof newPos.x !== 'undefined' ? newPos.x : this.x;
        this.y = typeof newPos.y !== 'undefined' ? newPos.y : this.y;
        this.z = typeof newPos.z !== 'undefined' ? newPos.z : this.z;
    }
}