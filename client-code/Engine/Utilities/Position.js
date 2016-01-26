Position = function(x, y, z){
    this.X = x || 0;
    this.Y = y || 0;
    this.Z = z || 0;
}

Engine.Utilities.Position = {
    CreatePosition: function CreatePosition(x, y, z){
        return new Position(x, y, z);
    },
    Distance: function Distance(fromPos, toPos){
        var tx = toPos.X - fromPos.X,
            ty = toPos.Y - fromPos.Y,
            tz = toPos.Z - fromPos.Z;
            return Math.sqrt(tx*tx+ty*ty+tz*tz);
    },
    SetPos: function SetPos(position, newPos){
        position.X = typeof newPos.X !== 'undefined' ? newPos.X : position.X;
        position.Y = typeof newPos.Y !== 'undefined' ? newPos.Y : position.Y;
        position.Z = typeof newPos.Z !== 'undefined' ? newPos.Z : position.Z;
    }
}