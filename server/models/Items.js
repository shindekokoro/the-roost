const { Schema, model } = require('mongoose');

const itemSchema = new Schema({
    name:{
        type:String,
        required: true,
    },
    description: {
        type:String,
        required: true,
    },
    strength:{
        type:Number,
    },
    defense: {
        type:Number,
    },
    constitution: {
        type:Number,
    }
});

const Item = model('items', itemSchema);

module.exports = Item;