Game.Equipment.Equipment = function(){
    this.image = "";
    this.slot = "";
    this.weight = 0;
    this.durability = 10;
    this.max_durability = 10;
    this.name = "";
    this.stats = {};
    this.animation = "";
    this.animations = [];
};

Game.Equipment.Equipment.CreateEquipment = function CreateEquipment(name) {
    var eq = new Game.Equipment.Equipment();
    switch (name) {
        case "male_body":
            eq.image = "male";
            eq.slot = "body";
            eq.weight = 0;
            eq.name = "Body";
            eq.stats = {};
            break;
        case "noob_pants":
            eq.image = "pants_greenish";
            eq.slot = "legs";
            eq.weight = 1;
            eq.name = "Noob Pants";
            eq.stats = {
                armor: 1
            }
            break;
        case "noob_shoes":
            eq.image = "shoes_brown";
            eq.slot = "feet";
            eq.weight = 1;
            eq.name = "Noob Shoes";
            eq.stats = {
                armor: 1
            }
            break;
        case "noob_vest":
            eq.image = "leather_armor_shirt_white";
            eq.slot = "torso";
            eq.weight = "1";
            eq.name = "Noob Vest";
            eq.stats = {
                armor: 2
            }
            break;
        case "noob_knife":
            eq.image = "knife";
            eq.slot = "weapon";
            eq.weight = "1";
            eq.name = "Noob Knife";
            eq.stats = {};
            break;
    }
    eq.animations['walk'] = Engine.Render.Animation.CreateAnimation({
        imageUrl: eq.getImageName("walkcycle"),
        startFrame: 1
    });
    eq.animations['stand'] = Engine.Render.Animation.CreateAnimation({
        imageUrl: eq.getImageName("walkcycle"),
        endFrame: 0
    });
    eq.animations['thrust'] = Engine.Render.Animation.CreateAnimation({
        imageUrl: eq.getImageName("thrust")
    });
    eq.animations['bow'] = Engine.Render.Animation.CreateAnimation({
        imageUrl: eq.getImageName("bow")
    });
    eq.animations['hurt'] = Engine.Render.Animation.CreateAnimation({
        imageUrl: eq.getImageName("hurt")
    });
    eq.animations['slash'] = Engine.Render.Animation.CreateAnimation({
        imageUrl: eq.getImageName("slash")
    });
    eq.animations['spellcast'] = Engine.Render.Animation.CreateAnimation({
        imageUrl: eq.getImageName("spellcast"),
        loop: false
    });
    eq.animation = "stand";
    return eq;
};

Game.Equipment.Equipment.prototype = {
    getImageName: function getImageName(type){
        return "/images/characters/" + type + "/" + this.slot.toUpperCase() + "_" + this.image + ".png";
    },
    setAnimation: function setAnimation(animation){
        if(this.animations[animation] != undefined){
            this.animation = animation;
        }
    }
};