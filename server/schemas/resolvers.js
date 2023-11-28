const { User, Combat, Movement, Interaction, Character } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    users: async () => {
      return User.find();
    },
    user: async (parent, { username }) => {
      return User.findOne({ username });
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw AuthenticationError;
    },
    combat: async () => { 
      return Combat.find();
    },
    movement: async () => { 
      return Movement.find();
    },
    interaction: async () => { 
      return Interaction.find();
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
