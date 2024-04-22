// A GraphQL schema that defines types, queries and mutations
var GraphQLObjectType = require("graphql").GraphQLObjectType;
var GraphQLList = require("graphql").GraphQLList;
var GraphQLObjectType = require("graphql").GraphQLObjectType;
var GraphQLNonNull = require("graphql").GraphQLNonNull;
var GraphQLString = require("graphql").GraphQLString;
var UserModel = require("../models/User");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "some_secret_key";
const jwtExpirySeconds = 24 * 60 * 60; // 24 hours

// Create a GraphQL Object Type for User model
// The fields object is a required property of a GraphQLObjectType
// and it defines the different fields or query/mutations that are available
// in this type.
const userType = new GraphQLObjectType({
  name: "user",
  fields: function () {
    return {
      userName: {
        type: GraphQLString,
      },
      email: {
        type: GraphQLString,
      },
      password: {
        type: GraphQLString,
      },
      role: {
        type: GraphQLString,
      },
    };
  },
});

// Create a GraphQL query type that returns a user by id
// In this case, the queries are defined within the fields object.
// The fields object is a required property of a GraphQLObjectType
// and it defines the different fields or query/mutations that are available
// in this type.
const queryType = new GraphQLObjectType({
  name: "Query",
  fields: function () {
    return {
      users: {
        type: new GraphQLList(userType),
        resolve: function () {
          const users = UserModel.find().exec();
          if (!users) {
            throw new Error("Error");
          }
          return users;
        },
      },
      user: {
        type: userType,
        args: {
          id: {
            name: "_id",
            type: GraphQLString,
          },
        },
        resolve: function (root, params) {
          const userInfo = UserModel.findById(params.id).exec();
          if (!userInfo) {
            throw new Error("Error");
          }
          return userInfo;
        },
      },
      // check if user is logged in
      isLoggedIn: {
        type: GraphQLString,
        resolve: function (root, params, context) {
          // Obtain the session token from the request cookies
          const token = context.req.cookies.token;

          // If the cookie is not set, return 'auth'
          if (!token) {
            return "auth";
          }

          // Verify the token and extract the payload
          let payload;
          try {
            payload = jwt.verify(token, JWT_SECRET);
          } catch (e) {
            // If the token is unauthorized or invalid, return 'auth'
            return "auth";
          }

          // If the token is valid, return the username from the payload
          return payload.userName;
        },
      },
    };
  },
});

// Add a mutation for creating user
// In this case, the createUser mutation is defined within the fields object.
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: function () {
    return {
      createUser: {
        type: userType,
        args: {
          userName: {
            type: new GraphQLNonNull(GraphQLString),
          },
          email: {
            type: new GraphQLNonNull(GraphQLString),
          },
          password: {
            type: new GraphQLNonNull(GraphQLString),
          },
          role: {
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        resolve: function (root, params, context) {
          const userModel = new UserModel(params);
          const newUser = userModel.save();
          if (!newUser) {
            throw new Error("Error");
          }
          return newUser;
        },
      },

      // Mutation to log in the user
      loginUser: {
        type: new GraphQLObjectType({
          name: "LoginUserResponse",
          fields: () => ({
            email: { type: GraphQLString },
            role: { type: GraphQLString },
            token: { type: GraphQLString }, // Include token field here
          }),
        }),
        args: {
          email: { type: GraphQLString },
          password: { type: GraphQLString },
        },
        resolve: async function (root, { email, password }, context) {
          try {
            // Find the user by email
            const userInfo = await UserModel.findOne({ email }).exec();
            if (!userInfo) {
              throw new Error("User not found");
            }

            // Check if the password is correct
            const isValidPassword = await bcrypt.compare(
              password,
              userInfo.password
            );
            if (!isValidPassword) {
              throw new Error("Invalid login credentials");
            }

            // Generate JWT token
            const token = jwt.sign(
              {
                _id: userInfo._id,
                email: userInfo.email,
                userName: userInfo.userName,
                role: userInfo.role,
              },
              JWT_SECRET,
              { expiresIn: jwtExpirySeconds }
            );

            // Return user information along with the token
            return {
              email: userInfo.email,
              role: userInfo.role,
              token: token, // jwt token
            };
          } catch (error) {
            console.error("Error logging in:", error.message);
            throw new Error("Authentication failed");
          }
        },
      },

      // A mutation to log the user out
      logOut: {
        type: GraphQLString,
        resolve: (parent, args, { res }) => {
          res.clearCookie("token");
          console.log("Logged out successfully!");
          return "Logged out successfully!";
        },
      },
    };
  },
});

module.exports = { UserModel, queryType, mutation };
