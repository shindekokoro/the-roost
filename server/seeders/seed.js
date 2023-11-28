const db = require('../config/connection');
const { User, Combat, CombatResults, Interaction, InteractionOptions, InteractionResults, Movement, MovementOptions, MovementResults, Items, Character } = require('../models');

const userSeeds = require('./userSeeds.json');
const itemSeeds = require('./itemSeeds.json');
const characterSeeds = require('./characterSeeds.json');

const combatSeeds = require('./combatSeeds.json');
const combatResSeeds = require('./combatResSeeds.json');

const interactionSeeds = require('./interactionSeeds.json');
const interactionOpSeeds = require('./interactionOpSeeds.json');
const interactionResSeeds = require('./interactionResSeeds.json');

const movementSeeds = require('./movementSeeds.json');
const movementOpSeeds = require('./movementOpSeeds.json');
const movementResSeeds = require('./movementResSeeds.json');


db.once('open', async () => {
  try {
    await User.create(userSeeds);
    await Character.create(characterSeeds);
    await Items.create(itemSeeds);
    
    await Combat.create(combatSeeds);
    await CombatResults.create(combatResSeeds);

    await Interaction.create(interactionSeeds);
    await InteractionOptions.create(interactionOpSeeds);
    await InteractionResults.create(interactionResSeeds);

    await Movement.create(movementSeeds);
    await MovementOptions.create(movementOpSeeds);
    await MovementResults.create(movementResSeeds);

    console.log('Database seeded!');
    process.exit(0);
  } catch (err) {
    throw err;
  }
});