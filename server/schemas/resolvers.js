const { User, Combat, Movement, Interaction, Character } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    users: async () => {
      return User.find()
        .populate({
          path: 'character',
          populate: {
            path: 'inventory',
            model: 'items'
          }
        })
        .exec();
    },
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .populate({
          path: 'character',
          populate: {
            path: 'inventory',
            model: 'items'
          }
        })
        .exec();
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id })
          .populate({
            path: 'character',
            populate: {
              path: 'inventory',
              model: 'items'
            }
          })
          .exec();
      }
      throw AuthenticationError;
    },
    combat: async () => {
      return await Combat.find()
        .populate('inventory')
        .populate('result')
        .exec();
    },
    movement: async () => {
      return Movement.find()
        .populate({
          path: 'options',
          populate: {
            path: 'result',
            model: 'movementResults'
          }
        })
        .exec();
    },
    interaction: async () => {
      return Interaction.find()
        .populate({
          path: 'options',
          populate: {
            path: 'result',
            model: 'interactionResults'
          }
        })
        .exec();
    }
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const character = await Character.create({
        name: username,
        level: 1,
        xp: 0,
        strength: 1,
        defense: 1,
        constitution: 1,
        gold: 0
      });
      const user = await User.create({ username, email, password, character });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);

      return { token, user };
    },
    saveCharacter: async (parent, { characterData }, context) => {
      //rewrite this to save to character from context.user.username vs how it is now
      //will have to save char data and items too
      console.log(characterData);
      if (context.user) {
        const updatedCharacter = await Character.findByIdAndUpdate(
          { _id: characterData._id },
          { ...characterData },
          { new: true }
        )
          .populate('inventory')
          .exec();
        return updatedCharacter;
      }
      throw AuthenticationError;
    },
    newCharacter: async (parent, { characterData }, context) => {
      console.log(characterData);
      if (context.user) {
        const newCharacter = await Character.create({
          name: characterData.name,
          level: 1,
          xp: 0,
          strength: 1,
          defense: 1,
          constitution: 1,
          gold: 100,
          inventory: []
        });
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { character: newCharacter._id } },
          { new: true }
        )
          .populate({
            path: 'character',
            populate: {
              path: 'inventory',
              model: 'items'
            }
          })
          .exec();
        return newCharacter;
      }
      throw AuthenticationError;
    }
  }
};

module.exports = resolvers;
