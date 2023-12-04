const { Schema, model } = require('mongoose');

const itemSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  isEquipped: {
    type: Boolean,
    default: false
  },
  strength: {
    type: Number
  },
  defense: {
    type: Number
  },
  constitution: {
    type: Number
  }
});

const Items = model('items', itemSchema);

module.exports = Items;
