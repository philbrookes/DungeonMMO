Engine.Utilities.PreloadedImage = function(src){
    this.image = new Image();
    this.imageReady = false;
    var me = this;
    this.image.addEventListener("load", function(){
        me.imageReady = true;
    });
    this.image.src = src;
};

Engine.Utilities.ImageLoader = {
    images: {},
    Load: function Load(src){
        if(typeof Engine.Utilities.ImageLoader.images[src] !== 'undefined'){
            return Engine.Utilities.ImageLoader.images[src];
        }

        Engine.Utilities.ImageLoader.images[src] = new Engine.Utilities.PreloadedImage(src);

        return Engine.Utilities.ImageLoader.images[src];
    }
};