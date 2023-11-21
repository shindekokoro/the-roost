const { Schema, model } = require('mongoose');

const movementOptionsSchema = new Schema ({
    description:{
        type:String,
        required:true,
    },
    result: [
        {
            type:Schema.Types.ObjectId,
            ref:'movementResults'
        }
    ]
});

const MovementOptions = model('movementOptions', movementOptionsSchema);

module.exports = MovementOptions;