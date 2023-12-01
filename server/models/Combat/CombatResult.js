const { Schema, model } = require('mongoose');

const combatResultSchema = new Schema ({
    description:{
        type:String,
        required:true,
    },
    ///the stat to modify on the front end, if any i.e hp, strength, etc
    statToModify:{
        type:String,
    },
    //value to modify the stat above
    statValue:{
        type:Number
    },
    //next event to serve up. pulled random from the frond end?
    nextEvent:{
        type:String,
    }
});

const CombatResults = model('combatResults', combatResultSchema);

module.exports = CombatResults;