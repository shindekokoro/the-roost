const { Schema, model } = require('mongoose');

const interactionOptionsSchema = new Schema({
  description: {
    type: String,
    required: true
  },
  result: [
    {
      type: Schema.Types.ObjectId,
      ref: 'interactionResults'
    }
  ]
});

const InteractionOptions = model(
  'interactionOptions',
  interactionOptionsSchema
);

module.exports = InteractionOptions;
