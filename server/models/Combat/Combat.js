const { Schema, model } = require('mongoose');

const combatSchema = new Schema({
  description: {
    type: String
  },
  background: {
    type: String
  },
  name: {
    type: String
  },
  level: {
    type: Number
  },
  strength: {
    type: Number
  },
  defense: {
    type: Number
  },
  constitution: {
    type: Number
  },
  inventory: [
    {
      type: Schema.Types.ObjectId,
      ref: 'items'
    }
  ],
  result: [
    {
      type: Schema.Types.ObjectId,
      ref: 'combatResults'
    }
  ]
});

const Combat = model('combat', combatSchema);

module.exports = Combat;
