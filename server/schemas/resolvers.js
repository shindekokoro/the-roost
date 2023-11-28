const { User, Combat, Movement, Interaction, Character } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    users: async () => {
      return User.find().populate('character').populate('items');
    },
    user: async (parent, { username }) => {
      return User.findOne({ username }).populate('character').populate('items');
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('character').populate('items');
      }
      throw AuthenticationError;
    },
    combat: async () => { 
      return Combat.find().populate('items').populate('combatResults');
    },
    movement: async () => { 
      return Movement.find().populate('interactionOptions').populate('interactionResults');
    },
    interaction: async () => { 
      return Interaction.find().populate('interactionOptions').populate('interactionResults');
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
