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
    stats: [
        {
            type:Schema.Types.ObjectId,
            ref:'skills'
        }
    ]
});

const Item = model('items', itemSchema);

module.exports = Item;