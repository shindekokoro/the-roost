const { Schema, model } = require('mongoose');

const charSchema = new Schema ({
    name:{
        type:String,
        required:true
    },
    level:{
        type:Number,
    },
    xp:{
        type:Number,
    },
    strength:{
        type:Number,
    },
    defense: {
        type:Number,
    },
    constitution: {
        type:Number,
    },
    inventory:[
        {
            type:Schema.Types.ObjectId,
            ref:'items'
        }
    ],
    gold: {
        type:Number,
    }
});

const Character = model('character', charSchema);

module.exports = Character;