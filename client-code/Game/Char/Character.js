Character = function Character(){
    this.name = "";
    this.Gear = {};
    this.Health = 0;
    this.MaxHealth = 100;
    this.action = "none";
    this.Pos = Engine.Utilities.Position.CreatePosition();
    this.Destination = Engine.Utilities.Position.CreatePosition();
    this.MovementSpeed = 35;
};

Game.Char.Character = {
    createCharacter: function CreateCharacter() {
        var char = new Character();
        char.gear = new Game.Char.GearSet.CreateGearSet();
        return char;
    },

    createNewCharacter: function CreateNewCharacter() {
        char = Game.Char.Character.createCharacter();
        Game.Char.GearSet.AddToGearSet(char.gear, Game.Equipment.Equippable.CreateEquipment("male_body"));
        Game.Char.GearSet.AddToGearSet(char.gear, Game.Equipment.Equippable.CreateEquipment("noob_shoes"));
        Game.Char.GearSet.AddToGearSet(char.gear, Game.Equipment.Equippable.CreateEquipment("noob_pants"));
        Game.Char.GearSet.AddToGearSet(char.gear, Game.Equipment.Equippable.CreateEquipment("noob_vest"));
        Game.Char.Character.SetMovementSpeed(char, 140);
        return char;
    },

    Render: function Render(character, timeSinceLastRender, context){
        Game.Char.GearSet.Render(character.gear, timeSinceLastRender, context);
        var distance = Engine.Utilities.Position.Distance(character.Pos, character.Destination);
        if(distance > 0){
            var movement = character.MovementSpeed * timeSinceLastRender;
            if ( movement > distance ){
                Engine.Utilities.Position.SetPos(character.Pos, character.Destination);
                Game.Char.Character.SetAction(character, "stand");
            } else {
                var tx = character.Destination.X - character.Pos.X;
                var ty = character.Destination.Y - character.Pos.Y;
                var velX = (tx/distance) * (character.MovementSpeed * timeSinceLastRender);
                var velY = (ty/distance) * (character.MovementSpeed * timeSinceLastRender);

                Game.Char.Character.SetAction(character, "walk");
                if ( Math.abs(tx) >= Math.abs(ty) ){
                    if(tx > 0) {
                        Game.Char.Character.SetDirection(character, Game.DIRECTIONS.EAST);
                    } else {
                        Game.Char.Character.SetDirection(character, Game.DIRECTIONS.WEST);
                    }
                } else {
                    if(ty > 0) {
                        Game.Char.Character.SetDirection(character, Game.DIRECTIONS.SOUTH);
                    } else {
                        Game.Char.Character.SetDirection(character, Game.DIRECTIONS.NORTH);
                    }
                }

                Engine.Utilities.Position.SetPos(character.Pos, {
                    X: character.Pos.X + velX,
                    Y: character.Pos.Y + velY
                });
                var cam = Engine.Render.Scene.GetCamera(Engine.Render.Renderer.GetScene(Engine.renderer));
                Engine.Utilities.Position.SetPos(cam.Pos, character.Pos);
            }
        }

    },

    SetDirection: function SetDirection(character, direction){
        if(character.hasOwnProperty("gear")) {
            Game.Char.GearSet.SetDirection(character.gear, direction);
        }
    },

    SetMovementSpeed: function SetDirection(character, speed){
        character.MovementSpeed = speed;
        if(character.hasOwnProperty("gear")) {
            for(var index in character.gear.order){
                var gear = character.gear[character.gear.order[index]];
                if(gear !== ""){
                    Engine.Render.Animation.SetSpeed(gear.animations["walk"], speed / 35);
                }
            }
        }
    },

    SetAction: function SetAction(character, action){
        character.action = action;
        if(character.hasOwnProperty("gear")) {
            Game.Char.GearSet.SetAction(character.gear, action);
        }
    },

    Move: function Move(character, direction){
        if(character.action != "stand"){
            return;
        }
        switch (direction){
            case Game.DIRECTIONS.NORTH:
                Engine.Utilities.Position.SetPos(character.Destination, {Y: character.Pos.Y - Game.MAP.TILES.SIZE.Y});
                break;
            case Game.DIRECTIONS.SOUTH:
                Engine.Utilities.Position.SetPos(character.Destination, {Y: character.Pos.Y + Game.MAP.TILES.SIZE.Y});
                break;
            case Game.DIRECTIONS.WEST:
                Engine.Utilities.Position.SetPos(character.Destination, {X: character.Pos.X - Game.MAP.TILES.SIZE.X});
                break;
            case Game.DIRECTIONS.EAST:
                Engine.Utilities.Position.SetPos(character.Destination, {X: character.Pos.X + Game.MAP.TILES.SIZE.X});
                break;
        }
    },

    Teleport: function Teleport(character, position){
        Engine.Utilities.Position.SetPos(character.Pos, position);
        Engine.Utilities.Position.SetPos(character.Destination, position);
    }
};