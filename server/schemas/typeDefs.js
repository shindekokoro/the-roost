const typeDefs = `
  type User {
    _id: ID
    username: String!
    email: String!
    password: String!
    character: [Character]
  }

  type Auth {
    token: ID!
    user: User
  }

  type Character {
    _id: ID
    name: String!
    level: Number
    xp: Number
    strength: Number
    defense: Number
    constitution: Number
    inventory: [Item]
  }

  type Item {
    _id: ID
    name: String!
    description: String!
    strength: Number
    defense: Number
    constitution: Number
  }

  type Combat {
    _id: ID
    description: String
    background: String
    name: String
    level: Number
    strength: String
    defense: String
    constitution: String
    inventory: [Item]
    result: [CombatResult]
  }

  type CombatResult {
    _id: ID
    description: String!
    statToModify: String
    nextEvent: String
  }

  type Interaction {
    _id: ID
    description: String
    background: String
    name: String
    options: [InteractionOption]
  }

  type InteractionOption {
    _id: ID
    description: String
    result: [InteractionResult]
  }

  type InteractionResult {
    _id: ID
    description: String!
    statToModify: String
    nextEvent: String
  }

  type Movement {
    _id: ID
    description: String
    background: String
    name: String
    options: [MovementOption]
  }

  type MovementOption {
    _id: ID
    description: String
    result: [MovementResult]
  }

  type MovementResult {
    _id: ID
    description: String!
    statToModify: String
    nextEvent: String
  }

  input CharacterObject {
    _id: ID
    name: String!
    level: Number
    xp: Number
    strength: Number
    defense: Number
    constitution: Number
    inventory: [Item]
  }

  type Query {
    users: [User]
    user(username: String!): User
    me: User
    combat: [Combat]
    interaction: [Interaction]
    movement: [Movement]
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveCharacter(_id: ID!, character: CharacterObject!): User
  }
`;

module.exports = typeDefs;
