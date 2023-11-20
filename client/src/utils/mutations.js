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


/**
 * More an example than an actual implementation
 */ 
// export const QUERY_CHARACTER = gql`
//   query character {
//     character {
//       name
//       hp
//       level
//       xp
//       skills {
//         strength
//         defense
//         constitution
//       }
//       equipment []
//     }
//   }
// `;

// export const GET_ENEMY = gql`
//   query enemy {
//     enemy {
//       description
//       background
//       name
//       hp
//       skills {
//         strength
//         defense
//         constitution
//       }
//       equipment []
//     }
//   }
// `;

// export const GET_INTERACTION = gql`
//   query interaction {
//     interaction {
//       description
//       background
//       options [
//         {
//           description
//           result [
//             {
//               xp
//               hp
//               addItem [
//                 {
//                   name
//                   description
//                 }
//               ]
//               nextEvent
//             }
//           ]
//         }
//       ]
//     }
//   }
// `;

// export const GET_MOVEMENT = gql`
//   query interaction {
//     interaction {
//       description
//       background
//       options [
//         {
//           description
//           result [
//             {
//               description
//               nextEvent
//             }
//           ]
//         }
//       ]
//     }
//   }
// `;