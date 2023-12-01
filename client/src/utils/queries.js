import { gql } from '@apollo/client';

export const QUERY_USERS = gql`
  query users {
    users {
      _id
      username
      email
      character {
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
  } 
`;

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      character {
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
  }
`;

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      character {
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
  }
`;

export const QUERY_COMBAT_EVENTS = gql `query combat {
  combat {
    _id
    description
    background
    name
    level
    strength
    defense
    constitution
    inventory {
      _id
      isEquipped
      name
      description
      strength
      defense
      constitution
    }
    result {
      _id
      description
      statToModify
      statValue
      nextEvent
    }
  }
}
`;

export const QUERY_MOVEMENT_EVENTS = gql`
  query movement {
    movement {
      _id
      description
      background
      name
      options {
        _id
        description
        result {
          _id
          description
          statToModify
          statValue
          nextEvent
        }
      }
    }
  }
`;

export const QUERY_INTERACTION_EVENTS = gql`
  query interaction {
    interaction {
      _id
      description
      background
      name
      options {
        _id
        description
        result {
          _id
          description
          statToModify
          statValue
          nextEvent
        }
      }
    }
  }
`;