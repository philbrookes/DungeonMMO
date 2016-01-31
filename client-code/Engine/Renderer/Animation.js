Animation = function(){
    this.startFrame = 0;
    this.endFrame = null;
    this.frame = 0;
    this.loop = true;
    this.row = 0;
    this.frameHeight = 64;
    this.frameWidth = 64;
    this.timePerFrame = 0.1;
    this.timeThisFrame = 0;
    this.speed=1;
    this.image = new Image();
    this.imageReady = false;
    this.onFinish = null;
};

Engine.Render.Animation = {
    CreateAnimation: function CreateAnimation(options){
        var anim = new Animation();
        anim.frameHeight = options.fHeight || 64;
        anim.frameWidth = options.fWidth || 64;
        anim.startFrame = typeof options.startFrame != 'undefined' ? options.startFrame : 0;
        anim.endFrame = options.endFrame;
        anim.speed = options.speed || 1;
        anim.loop = typeof options.loop != 'undefined' ? options.loop : true;
        anim.image = new Image();
        anim.image.addEventListener("load", function() {
            anim.imageReady = true;
        }, false);
        anim.image.src = options.imageUrl;



        return anim;
    },
    Render: function Render(animation, timeSinceLastRender, context){
        if(animation.imageReady){
             context.drawImage(
                animation.image,
                animation.frame * animation.frameWidth,
                animation.row * animation.frameHeight,
                animation.frameWidth,
                animation.frameHeight,
                -(animation.frameWidth / 2),
                -(animation.frameHeight / 2),
                animation.frameWidth,
                animation.frameHeight
            );
            animation.timeThisFrame += timeSinceLastRender;
            if ( animation.timeThisFrame >= animation.timePerFrame / animation.speed) {
                animation.timeThisFrame = 0;
                animation.frame++;
                var atFrameLimit = animation.endFrame !== null && animation.frame >= animation.endFrame;
                var atLastFrame = animation.image.width <= animation.frameWidth * animation.frame;
                if (animation.loop && ( atFrameLimit || atLastFrame )) {
                    animation.frame = animation.startFrame;
                }
            } else if ( typeof animation.onFinish === 'function' ){
                animation.onFinish();
            }
        }
    },
    SetRow: function SetRow(animation, row){
        animation.row = row;
    },
    SetSpeed: function SetSpeed(animation, speed){
        animation.speed = speed;
    }
};