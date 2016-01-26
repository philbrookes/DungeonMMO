GearSet = function(){
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

Game.Char.GearSet = {
    CreateGearSet: function CreateGearSet() {
        return new GearSet();
    },
    AddToGearSet: function AddToGearSet(gearset, item) {
        //bad slot
        if (typeof gearset[item.slot] === "undefined") {
            return false;
        }
        //already filled that slot
        if (gearset[item.slot] !== "") {
            return false;
        }

        gearset[item.slot] = item;

        return true;
    },
    Render: function Render(gearset, timeSinceLastRender, context) {
        if ( ! Game.Char.GearSet.AnimReady(gearset)){
            return;
        }
        for (index in gearset.order) {
            var item = gearset.order[index];
            if (gearset[item] !== "") {
                Engine.Render.Animation.Render(gearset[item].animations[gearset[item].animation], timeSinceLastRender, context);
            }
        }
    },
    AnimReady: function AnimReady(gearset) {
        if(this.AnimReady){
            return true;
        }
        for (index in this.order) {
            var item = this.order[index];
            if(! this[item].anim.imageReady){
                return false;
            }
        }
        this.AnimReady = true;
        return true;
    },
    SetDirection: function SetDirection(gearset, direction){
        if(gearset.hasOwnProperty("order")) {
            for (index in gearset.order) {
                var item = gearset.order[index];
                if (gearset[item] !== "") {
                    for(var animIndex in gearset[item].animations) {
                        Engine.Render.Animation.SetRow(gearset[item].animations[animIndex], direction);
                    }
                }
            }
        }
    },
    SetAction: function SetAction(gearset, action){
        if(gearset.hasOwnProperty("order")) {
            for (index in gearset.order) {
                var item = gearset.order[index];
                if (gearset[item] !== "") {
                    Game.Equipment.Equippable.SetAnimation(gearset[item], action);
                }
            }
        }
    }
}