const { Schema, model } = require('mongoose');

const interactionSchema = new Schema ({
    description: {
        type: String,
    },
    background: {
        type: String,
    },
    name: {
        type:String,
    },
    options: [
        {
            type:Schema.Types.ObjectId,
            ref:'interactionOptions'
        }
    ],
});

const Interaction = model('interaction', interactionSchema);

module.exports = Interaction;