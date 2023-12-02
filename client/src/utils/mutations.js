import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_CHARACTER = gql`
  mutation saveCharacter($characterData: CharacterObject!) {
    saveCharacter(characterData: $characterData) {
        _id
        name
        level
        xp
        strength
        defense
        constitution
        gold
        inventory {
          _id
          name
          isEquipped
          description
          strength
          defense
          constitution
      }
    }
  }
`;

export const NEW_CHARACTER = gql`
  mutation newCharacter($characterData: CharacterObject!) {
    newCharacter(characterData: $characterData) {
        _id
        name
        level
        xp
        strength
        defense
        constitution
        gold
        inventory {
          _id
          name
          isEquipped
          description
          strength
          defense
          constitution
      }
    }
  }
`;