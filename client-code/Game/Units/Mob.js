Game.Units.Mob = function(){
    this.health = 0;
    this.maxHealth = 100;
    this.pos = new Engine.Utilities.Position();
    this.destination = new Engine.Utilities.Position();
    this.movementSpeed = 35;
    this.attackSpeed = 1;
    this.attackEnabled = true;

    this.moveTime = 30;
    this.lastMove = Game.DIRECTIONS.NONE;

    this.shadow = Engine.Utilities.ImageLoader.Load("/images/characters/shadows/shadow.png");
    this.image = Engine.Utilities.ImageLoader.Load("/images/characters/walkcycle/BODY_skeleton.png");
};

/**
 *
 * @param {Object}                       options
 * @param {int}                          options.health
 * @param {int}                          options.maxHealth
 * @param {Engine.Utilities.Position}    options.pos
 * @param {Engine.Utilities.Position}    options.destination
 * @param {int}                          options.movementSpeed
 * @param {int}                          options.attackSpeed
 * @param {int}                          options.attackEnabled
 * @param {int}                          options.moveTime
 * @param {int}                          options.lastMove
 * @param {string}                       options.shadow
 * @param {string}                       options.image
 */
Game.Units.Mob.newMob = function newMob(options){
    var mob = new Game.Units.Mob();
    mob.health         = options.hasOwnProperty("health")          ? options.health        : mob.health;
    mob.maxHealth      = options.hasOwnProperty("maxHealth")       ? options.maxHealth     : mob.maxHealth;
    mob.pos            = options.hasOwnProperty("pos")             ? options.pos           : mob.pos;
    mob.destination    = options.hasOwnProperty("destination")     ? options.destination   : mob.destination;
    mob.movementSpeed  = options.hasOwnProperty("movementSpeed")   ? options.movementSpeed : mob.movementSpeed;
    mob.attackSpeed    = options.hasOwnProperty("attackSpeed")     ? options.attackSpeed   : mob.attackSpeed;
    mob.attackEnabled  = options.hasOwnProperty("attackEnabled")   ? options.attackEnabled : mob.attackEnabled;
    mob.moveTime       = options.hasOwnProperty("moveTime")        ? options.moveTime      : mob.moveTime;
    mob.lastMove       = options.hasOwnProperty("lastMove")        ? options.lastMove      : mob.lastMove;

    if( options.shadow ){
        mob.shadow = Engine.Utilities.ImageLoader.Load(options.shadow);
    }
    if ( options.image ){
        mob.image = Engine.Utilities.ImageLoader.Load(options.image);
    }

    if(mob.moveTime > 0){
        setTimeout(function(){mob.assignDestination()}, mob.moveTime * 1000)
    }

    return mob
};

Game.Units.Mob.prototype = {
    render: function render(timeSinceLastRender, context){

        if(this.pos.moveTowards(this.destination, this.movementSpeed, timeSinceLastRender)){
            var mob = this;
            setTimeout(function(){mob.assignDestination()}, mob.moveTime * 1000)
        }

        if (this.shadow.imageReady) {
            context.drawImage(this.shadow.image, 0, 0, 64, 64, -32, -28, 64, 64);
        }

        if (this.image.imageReady) {
            context.drawImage(this.image.image, 0, 128, 64, 64, -32, -32, 64, 64);
        }
    },

    assignDestination: function assignDestination(){
        //pick a random into between 0 and 3
        var firstMove = Math.round(Math.random() * 3);

        //iterate over all directions
        for(i=0;i<3;i++){
            var move = (firstMove + i) % 4;
            if(this.lastMove != this.pos.invertDirection(move)){
                if(this.checkAndMove(move)){
                    return;
                }
            }
        }
        //no moves found, undo previous move
        this.checkAndMove(this.pos.invertDirection(this.lastMove));
    },

    checkAndMove: function checkAndMove(direction) {
        if(this.pos.hasExit(direction)){
            this.destination = this.pos.tileOffset(direction);
            this.lastMove = direction;
            return true;
        }
        return false;
    }
};

