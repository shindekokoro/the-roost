const { Schema, model } = require('mongoose');

const optionResultSchema = new Schema ({
    description:{
        type:String,
        required:true,
    },
    statToModify:{
        type:String,
    },
    nextEvent:{
        type:String,
    }
});

const OptionResults = model('interactionOptions', optionResultSchema);

module.exports = OptionResults;