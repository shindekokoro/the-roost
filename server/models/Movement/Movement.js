const { Schema, model } = require('mongoose');

const movementSchema = new Schema({
  description: {
    type: String
  },
  background: {
    type: String
  },
  name: {
    type: String
  },
  options: [
    {
      type: Schema.Types.ObjectId,
      ref: 'movementOptions'
    }
  ]
});

const Movement = model('movement', movementSchema);

module.exports = Movement;
