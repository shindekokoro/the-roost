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

const seedNestedUsers = async () => {
  //nest the proper object IDs
  const allUsers = await User.find();
  const allCharacters = await Character.find();
  const allItems = await Items.find();
  for (let i = 0; i < allUsers.length; i++) {
    let randomItemID = allItems[Math.floor(Math.random() * allItems.length)]._id;
    await Character.findOneAndUpdate(
      {_id:`${allCharacters[i]._id}`},
      {$push: {inventory:randomItemID}},
      {new: true}
    );
    await  User.findOneAndUpdate(
      {_id:`${allUsers[i]._id}`},
      { $push: {character: allCharacters[i]._id}},
      {new: true}
    );
  }
}

const seedNestedCombat = async () => {
  //nest the proper object IDs
  const allCombat = await Combat.find();
  const allCombatResults = await CombatResults.find();
  const allItems = await Items.find();
  for (let i = 0; i < allCombat.length; i++) {
    let randomItemID = allItems[Math.floor(Math.random() * allItems.length)];
    await Combat.findOneAndUpdate(
      {_id:`${allCombat[i]._id}`},
      {$push: {inventory:randomItemID._id}},
      {new: true}
    );  
    allCombatResults.forEach(async (element) => {
      await Combat.findOneAndUpdate(
        {_id:`${allCombat[i]._id}`},
        {$push: {result:`${element._id}`}},
        {new:true}
      );
    });
  }
}

const seedNested = async (base, options, results) => {
  const allBase = await base.find();
  const allOptions = await options.find();
  const allResults = await results.find();

  for (const option of allOptions) {
    for (const result of allResults) {
      await options.findOneAndUpdate(
        {_id: option._id},
        {$push: {result:result._id}},
        {new:true}
      );
    }
  }
  for (const baseModel of allBase) {
    for (const option of allOptions) {
      await base.findOneAndUpdate(
        {_id: baseModel._id},
        {$push: {options:option._id}},
        {new:true}
      );
    }
  }
}

db.once('open', async () => {
  try {
    //only uncomment this in dev environment
    db.dropDatabase("the-roost");
    await User.create(userSeeds);
    await Character.create(characterSeeds);
    await Items.create(itemSeeds);
    await seedNestedUsers();
    
    await Combat.create(combatSeeds);
    await CombatResults.create(combatResSeeds);
    await seedNestedCombat();

    await Interaction.create(interactionSeeds);
    await InteractionOptions.create(interactionOpSeeds);
    await InteractionResults.create(interactionResSeeds);
    await seedNested(Interaction, InteractionOptions, InteractionResults);

    await Movement.create(movementSeeds);
    await MovementOptions.create(movementOpSeeds);
    await MovementResults.create(movementResSeeds);
    await seedNested(Movement, MovementOptions, MovementResults);
    

    console.log('Database seeded!');
    process.exit(0);
  } catch (err) {
    throw err;
  }
});