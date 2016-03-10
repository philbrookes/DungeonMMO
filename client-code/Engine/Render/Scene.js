Engine.Render.scene = function(){
    this.camera = {};
    this.clearColor = "#000000";
    this.layers = [];
};

Engine.Render.scene.prototype = {
    addRenderItem: function addRenderItem(item, layer){
        if(typeof this.layers[layer] == 'undefined'){
            this.layers[layer] = {
                RenderItems: []
            }
        }

        var items = this.layers[layer].RenderItems;

        if(items.indexOf(item) === -1){
            items.push(item);
        }
    },
    clearLayer: function clearLayer(layer){
        if(typeof this.layers[layer] != 'undefined') {
            this.layers[layer].RenderItems = [];
        }
    },
    removeRenderItem: function removeRenderItem(item){
        for(var layerIndex in this.layers) {
            var layer = this.layers[layerIndex];
            var index = layer.RenderItems.indexOf(item);
            if (index !== -1) {
                layer.RenderItems.splice(index, 1);
            }
        }
    },
    getRenderItems: function getRenderItems(layer){
        if( typeof this.layers[layer] == 'undefined'){
            return [];
        }
        return this.layers[layer].renderItems;
    },
    getLayers: function getRenderItems(){
        return this.layers;
    },
    setCamera: function setCamera(camera){
        this.camera = camera;
    },
    getCamera: function getCamera(){
        return this.camera;
    },
    setClearColor: function setClearColor(color){
        this.clearColor = color;
    },
    getClearColor: function getClearColor(){
        return this.clearColor;
    }
};