const { Schema, model } = require('mongoose');

const movementResultSchema = new Schema ({
    description:{
        type:String,
        required:true,
    },
     ///the stat to modify on the front end, if any i.e hp, strength, etc
    statToModify:{
        type:String,
    },
    //next event to serve up. pulled random from the frond end?
    nextEvent:{
        type:String,
    }
});

const movementResults = model('movementResults', movementResultSchema);

module.exports = movementResults;