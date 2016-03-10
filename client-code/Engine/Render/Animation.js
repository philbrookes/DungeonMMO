Engine.Render.Animation = function(){
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
};

Engine.Render.Animation.CreateAnimation = function CreateAnimation(options){
    var anim = new Engine.Render.Animation();
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
};

Engine.Render.Animation.prototype = {
    render: function Render(timeSinceLastRender, context){
        if(this.imageReady){
             context.drawImage(
                this.image,
                this.frame * this.frameWidth,
                this.row * this.frameHeight,
                this.frameWidth,
                this.frameHeight,
                -(this.frameWidth / 2),
                -(this.frameHeight / 2),
                this.frameWidth,
                this.frameHeight
            );
            this.timeThisFrame += timeSinceLastRender;
            if ( this.timeThisFrame >= this.timePerFrame / this.speed) {
                this.timeThisFrame = 0;
                this.frame++;
                var atFrameLimit = this.endFrame !== null && this.frame >= this.endFrame;
                var atLastFrame = this.image.width <= this.frameWidth * this.frame;
                if (( atFrameLimit || atLastFrame )) {
                    this.frame = this.startFrame;
                    if (typeof this.onFinish === 'function') {
                        this.onFinish();
                    }
                }
            }
        }
    },
    setRow: function setRow(row){
        this.row = row;
    },
    setSpeed: function setSpeed(speed){
        this.speed = speed;
    }
};