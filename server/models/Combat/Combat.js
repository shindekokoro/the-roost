const { Schema, model } = require('mongoose');

const combatSchema = new Schema ({
    description: {
        type: String,
    },
    background: {
        type: String,
    },
    name:{
        type: String,
    },
    //hp stat will be here, but will be calculated on the front end from stats, items, and other modifiers
    skills: [
        {
            type:Schema.Types.ObjectId,
            ref:'skills'
        }
    ],
    items: [
        {
            type:Schema.Types.ObjectId,
            ref:'items'
        }
    ]
});

const Combat = model('combat', combatSchema);

module.exports = Combat;