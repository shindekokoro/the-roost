const { Schema, model } = require('mongoose');

const skillSchema = new Schema({
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

const Skills = model('skills', skillSchema);

module.exports = Skills;