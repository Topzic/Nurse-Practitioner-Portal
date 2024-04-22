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

// Define the EmergencyAlert schema
const EmergencyAlertSchema = new mongoose.Schema({
  patient: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: GraphQLDate,
    required: true,
  },
});

// Create a EmergencyAlert model
const EmergencyAlert = mongoose.model(
  "EmergencyAlert",
  EmergencyAlertSchema
);

module.exports = EmergencyAlert;
