Engine.Render.Camera = function(position){
    this.pos = position;
}

Engine.Render.Camera.prototype = {
    getPosition: function getPosition(){
        return this.pos;
    },
    setPosition: function setPosition(position){
        this.pos.setPos(position);
    }
}