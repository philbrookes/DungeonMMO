Game.Character = function Character(){
    this.name = "";
    this.gear = {};
    this.health = 0;
    this.maxHealth = 100;
    this.action = "stand";
    this.pos = new Engine.Utilities.Position();
    this.destination = new Engine.Utilities.Position();
    this.movementSpeed = 35;
    this.shadow = Engine.Utilities.ImageLoader.Load("/images/characters/shadows/shadow.png");
    this.image = Engine.Utilities.ImageLoader.Load("/images/characters/walkcycle/BODY_male.png");
    this.attackSpeed = 1;
    this.attackEnabled = true;
    this.direction = Game.DIRECTIONS.SOUTH;
};

Game.Character.prototype = {
    render: function Render(timeSinceLastRender, context) {

        if (this.action !== "stand" && this.pos.moveTowards(this.destination, this.movementSpeed, timeSinceLastRender)) {
            this.setAction("stand");
        }

        var cam = Engine.renderer.getScene().getCamera();
        cam.pos.setPos(this.pos);

        if (this.shadow.imageReady) {
            context.drawImage(this.shadow.image, 0, 0, 64, 64, -32, -28, 64, 64);
        }

        if (this.image.imageReady)
        {
            context.drawImage(this.image.image, 0, 128, 64, 64, -32, -32, 64, 64);
        }

    },

    setDirection: function SetDirection(direction){
        this.direction = direction;
    },

    setMovementSpeed: function SetDirection(speed){
        this.movementSpeed = speed;
    },

    setAction: function SetAction(action, speed){
        this.action = action;
        for (var itemIndex in this.gear.order){
            var item = this.gear[itemIndex];
            if( typeof item !== 'undefined' ) {
                item.animations[action].frame = item.animations[action].startFrame;
            }
        }
    },

    move: function Move(direction){
        if(this.action != "stand"){
            return;
        }
        if(this.pos.hasExit(direction)){
            this.setAction("walking");
            this.destination = this.pos.tileOffset(direction);
            Game.updateMap(Engine.renderer.getScene(), this.destination);
        }
    },

    attack: function attack(){
        if(this.action != "stand" || ! this.attackEnabled){
            return;
        }

        this.setAction("spellcast");

        var me = this;
        setTimeout(function(){me.setAction("stand")}, 1000);

    },

    teleport: function teleport(position){
        this.pos.setPos(position);
        this.destination.setPos(position);
        Engine.renderer.getScene().getCamera().setPosition(this.pos);
    }
};