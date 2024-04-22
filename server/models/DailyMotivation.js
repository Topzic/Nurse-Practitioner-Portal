const mongoose = require("mongoose");
const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");
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

// Define the DailyMotivation schema
const DailyMotivationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  createdAt: {
    type: GraphQLDate,
    required: true,
  },
});

// Create a DailyMotivation model
const DailyMotivation = mongoose.model(
  "DailyMotivation",
  DailyMotivationSchema
);

module.exports = DailyMotivation;
