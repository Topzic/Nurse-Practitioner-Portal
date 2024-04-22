const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLList,
} = require("graphql");
const GraphQLDate = require("graphql-date");
const Vital = require("../models/Vital");

// Define Vital type
const vitalType = new GraphQLObjectType({
  name: "Vital",
  fields: () => ({
    id: { type: GraphQLString },
    patient: { type: GraphQLString },
    timestamp: { type: GraphQLDate },
    heartRate: { type: GraphQLInt },
    bloodPressure: { type: GraphQLString },
    temperature: { type: GraphQLFloat },
    respiratoryRate: { type: GraphQLInt },
  }),
});

// Define Query type
const queryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    getAllVitals: {
      type: new GraphQLList(vitalType),
      resolve: async () => {
        try {
          return await Vital.find();
        } catch (error) {
          throw new Error("Failed to fetch vitals");
        }
      },
    },
    getVitalById: {
      // New query field to get a single vital by ID
      type: vitalType,
      args: {
        id: { type: GraphQLString }, 
      },
      resolve: async (_, { id }) => {
        try {
          return await Vital.findById(id);
        } catch (error) {
          throw new Error("Failed to fetch vital by ID");
        }
      },
    },
  },
});

// Define Mutation type
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addVital: {
      type: vitalType,
      args: {
        patient: { type: new GraphQLNonNull(GraphQLString) },
        timestamp: { type: new GraphQLNonNull(GraphQLDate) },
        heartRate: { type: new GraphQLNonNull(GraphQLInt) },
        bloodPressure: { type: new GraphQLNonNull(GraphQLString) },
        temperature: { type: new GraphQLNonNull(GraphQLFloat) },
        respiratoryRate: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: async (_, args) => {
        const newVital = new Vital(args);
        return await newVital.save();
      },
    },
    createVital: {
      type: vitalType,
      args: {
        patient: { type: new GraphQLNonNull(GraphQLString) },
        timestamp: { type: new GraphQLNonNull(GraphQLDate) },
        heartRate: { type: new GraphQLNonNull(GraphQLInt) },
        bloodPressure: { type: new GraphQLNonNull(GraphQLString) },
        temperature: { type: new GraphQLNonNull(GraphQLFloat) },
        respiratoryRate: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: async (
        _,
        {
          patient,
          timestamp,
          heartRate,
          bloodPressure,
          temperature,
          respiratoryRate,
        }
      ) => {
        const newVital = new Vital({
          patient,
          timestamp,
          heartRate,
          bloodPressure,
          temperature,
          respiratoryRate,
        });
        return await newVital.save();
      },
    },
  },
});

// Define GraphQL schema
const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutation,
});

module.exports = { Vital, mutation, vitalType, schema };
