const mongoose = require("mongoose");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLList,
  GraphQLScalarType,
} = require("graphql");
const { Kind } = require("graphql/language");
const EmergencyAlert = require("../models/EmergencyAlert");

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

// Define EmergencyAlert type
const EmergencyAlertType = new GraphQLObjectType({
  name: "EmergencyAlert",
  fields: () => ({
    id: { type: GraphQLString },
    patient: { type: GraphQLString },
    message: { type: GraphQLString },
    createdAt: { type: GraphQLDate },
  }),
});

// Define Query type
const queryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    getAllEmergencyAlerts: {
      type: new GraphQLList(EmergencyAlertType),
      resolve: async () => {
        try {
          return await EmergencyAlert.find();
        } catch (error) {
          throw new Error("Failed to fetch emergency alert");
        }
      },
    },
    getEmergencyAlertById: {
      type: EmergencyAlertType,
      args: {
        id: { type: GraphQLString },
      },
      resolve: async (_, { id }) => {
        try {
          return await EmergencyAlert.findById(id);
        } catch (error) {
          throw new Error("Failed to fetch emergency alert by ID");
        }
      },
    },
  },
});

// Define Mutation type
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addEmergencyAlert: {
      type: EmergencyAlertType,
      args: {
        patient: { type: new GraphQLNonNull(GraphQLString) },
        message: { type: new GraphQLNonNull(GraphQLString) },
        createdAt: { type: new GraphQLNonNull(GraphQLDate) },
      },
      resolve: async (_, { patient, message, createdAt }) => {
        const newMotivation = new EmergencyAlert({
          patient,
          message,
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

module.exports = { EmergencyAlert, mutation, EmergencyAlertType, schema };
