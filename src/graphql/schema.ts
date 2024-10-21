import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
  }

  type Item {
    id: ID!
    name: String!
    price: Float!
  }

  type Query {
    users: [User!]!
    items: [Item!]!
  }

  type Mutation {
    register(email: String!, password: String!): User
    login(email: String!, password: String!): String
    createItem(name: String!, price: Float!): Item
  }
`;
