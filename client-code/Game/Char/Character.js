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
        var distance = this.pos.distance(this.destination);
        if (distance > 0) {
            var movement = this.movementSpeed * timeSinceLastRender;
            if (movement > distance) {
                this.pos.setPos(this.destination);
                this.setAction("stand");
            } else {
                var tx = this.destination.x - this.pos.x;
                var ty = this.destination.y - this.pos.y;
                var velX = (tx / distance) * (this.movementSpeed * timeSinceLastRender);
                var velY = (ty / distance) * (this.movementSpeed * timeSinceLastRender);

                if (this.action !== "walk") {
                    this.setAction("walk");
                }
                if (Math.abs(tx) >= Math.abs(ty)) {
                    if (tx > 0) {
                        this.setDirection(Game.DIRECTIONS.EAST);
                    } else {
                        this.setDirection(Game.DIRECTIONS.WEST);
                    }
                } else {
                    if (ty > 0) {
                        this.setDirection(Game.DIRECTIONS.SOUTH);
                    } else {
                        this.setDirection(Game.DIRECTIONS.NORTH);
                    }
                }

                this.pos.setPos({
                    x: this.pos.x + velX,
                    y: this.pos.y + velY
                });
                var cam = Engine.renderer.getScene().getCamera();
                cam.pos.setPos(this.pos);
            }
        }

        if (this.shadow.imageReady) {
            context.drawImage(this.shadow.image, 0, 0, 64, 64, -32, -28, 64, 64);
        }

        if (this.image.imageReady)
        {
            context.drawImage(
                this.image.image,
                0,
                128,
                64,
                64,
                -32,
                -32,
                64,
                64
            );
        }
        //this.gear.render(timeSinceLastRender, context);

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

        this.setDirection(direction);

        var currentTileX = this.pos.x / Game.MAP.TILES.SIZE.X;
        var currentTileY = this.pos.y / Game.MAP.TILES.SIZE.Y;
        switch (direction){
            case Game.DIRECTIONS.NORTH:
                if(typeof Game.Map.Data[currentTileX][currentTileY - 1] !== 'undefined') {
                    this.destination.setPos({y: this.pos.y - Game.MAP.TILES.SIZE.Y});
                }
                break;
            case Game.DIRECTIONS.SOUTH:
                if(typeof Game.Map.Data[currentTileX][currentTileY + 1] !== 'undefined') {
                    this.destination.setPos({y: this.pos.y + Game.MAP.TILES.SIZE.Y});
                }
                break;
            case Game.DIRECTIONS.WEST:
                if(typeof Game.Map.Data[currentTileX - 1][currentTileY] !== 'undefined') {
                    this.destination.setPos({x: this.pos.x - Game.MAP.TILES.SIZE.X});
                }
                break;
            case Game.DIRECTIONS.EAST:
                if(typeof Game.Map.Data[currentTileX + 1][currentTileY] !== 'undefined') {
                    this.destination.setPos({x: this.pos.x + Game.MAP.TILES.SIZE.X});
                }
                break;
        }
        Game.updateMap(Engine.renderer.getScene(), this.destination);
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