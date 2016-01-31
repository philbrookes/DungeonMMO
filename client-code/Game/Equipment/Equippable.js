Equipment = function(){
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

Game.Equipment.Equippable = {
    CreateEquipment: function CreateEquipment(name){
        var eq = new Equipment();
        switch (name) {
            case "male_body":
                eq.image = "male";
                eq.slot = "body";
                eq.weight = 0;
                eq.name = "Body";
                eq.stats = {};
                break;
            case "noob_pants":
                eq.image  = "plate_armor_pants";
                eq.slot   = "legs";
                eq.weight = 1;
                eq.name   = "Noob Pants";
                eq.stats  = {
                    armor: 1
                }
                break;
            case "noob_shoes":
                eq.image  = "plate_armor_shoes";
                eq.slot   = "feet";
                eq.weight = 1;
                eq.name   = "Noob Shoes";
                eq.stats  = {
                    armor: 1
                }
                break;
            case "noob_vest":
                eq.image  = "plate_armor_torso";
                eq.slot   = "torso";
                eq.weight = "1";
                eq.name   = "Noob Vest";
                eq.stats = {
                    armor: 2
                }
                break;
            case "noob_knife":
                eq.image  = "knife";
                eq.slot   = "weapon";
                eq.weight = "1";
                eq.name   = "Noob Knife";
                eq.stats = {};
                break;
        }
        eq.animations['walk'] = Engine.Render.Animation.CreateAnimation({
            imageUrl: Game.Equipment.Equippable.GetImageName(eq, "walkcycle"),
            startFrame: 1
        });
        eq.animations['stand'] = Engine.Render.Animation.CreateAnimation({
            imageUrl: Game.Equipment.Equippable.GetImageName(eq, "walkcycle"),
            endFrame: 0
        });
        eq.animations['thrust'] = Engine.Render.Animation.CreateAnimation({
            imageUrl: Game.Equipment.Equippable.GetImageName(eq, "thrust")
        });
        eq.animations['bow'] = Engine.Render.Animation.CreateAnimation({
            imageUrl: Game.Equipment.Equippable.GetImageName(eq, "bow")
        });
        eq.animations['hurt'] = Engine.Render.Animation.CreateAnimation({
            imageUrl: Game.Equipment.Equippable.GetImageName(eq, "hurt")
        });
        eq.animations['slash'] = Engine.Render.Animation.CreateAnimation({
            imageUrl: Game.Equipment.Equippable.GetImageName(eq, "slash")
        });
        eq.animations['spellcast'] = Engine.Render.Animation.CreateAnimation({
            imageUrl: Game.Equipment.Equippable.GetImageName(eq, "spellcast"),
            loop: false
        });
        eq.animation = "stand";
        return eq;
    },
    GetImageName: function getImageName(eq, type){
        return "/images/characters/" + type + "/" + eq.slot.toUpperCase() + "_" + eq.image + ".png";
    },
    SetAnimation: function setAnimation(eq, animation){
        if(eq.animations[animation] != undefined){
            eq.animation = animation;
        }
    }
};