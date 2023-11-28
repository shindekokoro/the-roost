const { User, Combat, Movement, Interaction, Character } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    users: async () => {
      return User.find().populate({
        path: 'character',
        populate: {
          path: 'inventory',
          model: 'items'
        }
      }).exec();
    },
    user: async (parent, { username }) => {
      return User.findOne({ username }).populate({
        path: 'character',
        populate: {
          path: 'inventory',
          model: 'items'
        }
      }).exec();
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate({
          path: 'character',
          populate: {
            path: 'inventory',
            model: 'items'
          }
        }).exec();

      }
      throw AuthenticationError;
    },
    combat: async () => { 
      return Combat.find().populate('items').populate('combatResults').exec();
    },
    movement: async () => { 
      return Movement.find().populate({
        path: 'options',
        populate: {
          path: 'result',
          model: 'movementResults'
        }
      }).exec();
    },
    interaction: async () => { 
      return Interaction.find().populate({
        path: 'options',
        populate: {
          path: 'result',
          model: 'interactionResults'
        }
      }).exec();
    }

  }, 

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const character = await Character.create(
        { name: username,
          level: 1,
          xp: 0,
          strength: 1,
          defense: 1,
          constitution: 1,
          gold: 0
        }
      )
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
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user.id },
          { $set: { character: characterData } },
          { new: true }
        );
        return updatedUser;
      }
      throw AuthenticationError;
    },
  },
};

module.exports = resolvers;
