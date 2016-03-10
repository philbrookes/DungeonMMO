Game.Char.GearSet = function(){
    this.body = "";
    this.belt = "";
    this.feet = "";
    this.hands = "";
    this.head = "";
    this.legs = "";
    this.torso = "";
    this.weapon = "";
    this.behind = "";
    this.order = ["behind", "body", "legs", "torso", "head", "feet", "hands", "belt", "weapon"];
};

Game.Char.GearSet.CreateGearSet = function CreateGearSet() {
    return new Game.Char.GearSet();
};
Game.Char.GearSet.prototype = {
    addToGearSet: function addToGearSet(item) {
        //bad slot
        if (typeof this[item.slot] === "undefined") {
            return false;
        }
        //already filled that slot
        if (this[item.slot] !== "") {
            return false;
        }

        this[item.slot] = item;

        return true;
    },
    render: function render(timeSinceLastRender, context) {
        if ( ! this.animReady()){
            return;
        }
        for (index in gearset.order) {
            var item = this.order[index];
            if (this[item] !== "") {

                this[item].animations["walk"].setSpeed(Game.character.movementSpeed / 75);

                this[item].setAnimation(Game.character.action);

                this[item].animations[gearset[item].animation].setRow(Game.character.direction);

                this[item].animations[gearset[item].animation].render(timeSinceLastRender, context);
            }
        }
    },
    animReady: function animReady() {
        if(this.animationReady){
            return true;
        }
        for (index in this.order) {
            var item = this.order[index];
            if(! this[item] || ! this[item].animation.imageReady){
                return false;
            }
        }
        this.animationReady = true;
        return true;
    }
}