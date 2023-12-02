const typeDefs = `
  type Users {
    _id: ID
    username: String!
    email: String!
    password: String!
    character: [Character]
  }

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
    level: Int
    xp: Int
    strength: Int
    defense: Int
    constitution: Int
    inventory: [Item]
    gold: Int
  }

  type Item {
    _id: ID
    isEquipped: Boolean
    name: String!
    description: String!
    strength: Int
    defense: Int
    constitution: Int
  }

  type Combat {
    _id: ID
    description: String
    background: String
    name: String
    level: Int
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
    statValue: Int
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
    statValue: Int
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
    statValue: Int
    nextEvent: String
  }

  input ItemInput {
    _id: ID
    name: String!
    isEquipped: Boolean!
    description: String!
    strength: Int
    defense: Int
    constitution: Int
  }

  input CharacterObject {
    _id: ID
    name: String!
    level: Int
    xp: Int
    strength: Int
    defense: Int
    constitution: Int
    inventory: [ItemInput]
    gold: Int
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
    saveCharacter(characterData: CharacterObject!): Character
    newCharacter(characterData: CharacterObject!): Character
  }
`;

module.exports = typeDefs;
