Engine.Utilities.RNG = {
    GenerateInclusiveInt: function GenerateInclusiveInt(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}