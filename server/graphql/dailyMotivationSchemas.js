const mongoose = require("mongoose");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLScalarType,
} = require("graphql");
const { Kind } = require("graphql/language");
const DailyMotivation = require("../models/DailyMotivation");

// Define Date scalar
const GraphQLDate = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  parseValue(value) {
    return new Date(value);
  },
  serialize(value) {
    return value.getTime();
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return parseInt(ast.value, 10);
    }
    return null;
  },
});

// Define DailyMotivation type
const dailyMotivationType = new GraphQLObjectType({
  name: "DailyMotivation",
  fields: () => ({
    id: { type: GraphQLString },
    message: { type: GraphQLString },
    author: { type: GraphQLString },
    createdAt: { type: GraphQLDate },
  }),
});

// Define Query type
const queryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    getAllDailyMotivations: {
      type: new GraphQLList(dailyMotivationType),
      resolve: async () => {
        try {
          return await DailyMotivation.find();
        } catch (error) {
          throw new Error("Failed to fetch daily motivations");
        }
      },
    },
    getDailyMotivationById: {
      type: dailyMotivationType,
      args: {
        id: { type: GraphQLString },
      },
      resolve: async (_, { id }) => {
        try {
          return await DailyMotivation.findById(id);
        } catch (error) {
          throw new Error("Failed to fetch daily motivation by ID");
        }
      },
    },
  },
});

// Define Mutation type
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addDailyMotivation: {
      type: dailyMotivationType,
      args: {
        message: { type: new GraphQLNonNull(GraphQLString) },
        author: { type: new GraphQLNonNull(GraphQLString) },
        createdAt: { type: new GraphQLNonNull(GraphQLDate) },
      },
      resolve: async (_, { message, author, createdAt }) => {
        const newMotivation = new DailyMotivation({
          message,
          author,
          createdAt,
        });
        return await newMotivation.save();
      },
    },
  },
});

// Define GraphQL schema
const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutation,
});

module.exports = { DailyMotivation, mutation, dailyMotivationType, schema };
