import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      thoughts {
        _id
        thoughtText
        createdAt
      }
    }
  }
`;

export const QUERY_CHARACTER = gql`
  query character {
    character {
      name
      hp
      level
      xp
      skills {
        strength
        defense
        constitution
      }
      equipment []
    }
  }
`;

export const GET_ENEMY = gql`
  query enemy {
    enemy {
      description
      background
      name
      hp
      skills {
        strength
        defense
        constitution
      }
      equipment []
    }
  }
`;

export const GET_INTERACTION = gql`
  query interaction {
    interaction {
      description
      background
      options [
        {
          description
          result [
            {
              xp
              hp
              addItem [
                {
                  name
                  description
                }
              ]
              nextEvent
            }
          ]
        }
      ]
    }
  }
`;

export const GET_MOVEMENT = gql`
  query interaction {
    interaction {
      description
      background
      options [
        {
          description
          result [
            {
              description
              nextEvent
            }
          ]
        }
      ]
    }
  }
`;