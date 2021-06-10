const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type User {
        _id: ID!
        diplayName: String!
        email: String!
        username: String!
        password: String!
        isAdmin: Boolean!
    }

    type AuthData {
        token: String!
        userId: String!
    }

    input UserInputData {
        username: String!
        email: String!
        displayName: String!
        password: String!
    }

    type RootQuery {
        login(username: String!, password: String!): AuthData!
        user: User!
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }

`)