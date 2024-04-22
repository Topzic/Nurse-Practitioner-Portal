const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

// A GraphQL schema that defines types, queries, and mutations
var GraphQLSchema = require("graphql").GraphQLSchema;
var GraphQLObjectType = require("graphql").GraphQLObjectType;
const { graphqlHTTP } = require("express-graphql");
const { graphql, buildSchema } = require("graphql");

const UserModel = require("../graphql/UserSchemas.js").UserModel;
const queryType = require("../graphql/UserSchemas.js").queryType;
const mutation = require("../graphql/UserSchemas.js").mutation;
const configureMongoose = require("../config/mongoose.js");

const port = 3003;

// Create database instance
const db = configureMongoose();

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors());

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "some_secret_key"; 
const jwtExpirySeconds = 24 * 60 * 60; // 24 hours

// GraphQL schema
const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutation,
});

// GraphQL endpoint
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

// Endpoint for user authentication
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Execute the loginUser mutation
    const { data, errors } = await graphql(
      schema,
      `
        mutation ($email: String!, $password: String!) {
          loginUser(email: $email, password: $password) {
            email
            role
            token
          }
        }
      `,
      null,
      { res },
      { email, password }
    );

    if (errors) {
      // Handle GraphQL errors
      console.error("GraphQL error:", errors);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      // Mutation executed successfully
      const result = data.loginUser;
      if (result === "auth") {
        // Authentication failed
        res.status(401).json({ message: "Authentication failed" });
      } else {
        // Authentication successful, cookie set by resolver
        res.status(200).json({
          message: "Login successful",
          role: result.role,
          token: result.token, // Return token in the response
        });
      }
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Define a POST endpoint for user creation
app.post("/user/create", async (req, res) => {
  try {
    // Extract user data from the request body
    const { userName, email, password } = req.body;

    const newUser = await UserModel.create({ userName, email, password });

    // Return the newly created user
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Endpoint for user logout
app.post("/user/logout", async (req, res) => {
  try {
    // Execute the logout mutation
    const { data, errors } = await graphql(
      schema,
      `
        mutation {
          logOut
        }
      `,
      null,
      { res }
    );

    if (errors) {
      // Handle GraphQL errors
      console.error("GraphQL error:", errors);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      // Logout successful
      res.status(200).json({ message: "Logged out successfully!" });
    }
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Mutation method to check token validity
app.post("/auth/checkToken", (req, res) => {
  const { token } = req.body;

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    res.status(200).json({ message: "Token is valid", decoded });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ message: "Token is invalid" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`User Microservice listening on port ${port}`);
});
