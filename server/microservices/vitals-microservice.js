const express = require("express");
const { typeDefs, resolvers } = require("../graphql/vitalSchemas.js");
const bodyParser = require("body-parser");
const cors = require("cors");
const Vital = require("../models/Vital.js");
const configureMongoose = require("../config/mongoose.js");
var GraphQLSchema = require("graphql").GraphQLSchema;
const { graphqlHTTP } = require("express-graphql");
const { graphql, buildSchema } = require("graphql");

const VitalModel = require("../graphql/vitalSchemas.js").Vital;
const queryType = require("../graphql/vitalSchemas.js").queryType;
const mutation = require("../graphql/vitalSchemas.js").mutation;
const schema = require("../graphql/vitalSchemas.js").schema;

// Create database instance
const db = configureMongoose();

// Initialize express app
const app = express();
const port = 3002;

// Enable CORS
app.use(cors());

// Apply middleware for parsing JSON bodies
app.use(bodyParser.json());

// GraphQL endpoint
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

// Define a route for getting a vital sign by ID
app.get("/vital/:id", async (req, res) => {
  try {
    const vitalId = req.params.id;

    // Execute the getVitalById query
    const { data, errors } = await graphql(
      schema,
      `
        query GetVitalById($id: String!) {
          getVitalById(id: $id) {
            id
            timestamp
            heartRate
            bloodPressure
            temperature
            respiratoryRate
          }
        }
      `,
      null,
      null,
      { id: vitalId }
    );

    // Check for errors
    if (errors) {
      console.error("Error fetching vital sign:", errors);
      return res.status(500).json({ error: "Failed to fetch vital sign" });
    }

    // Check if vital sign exists
    if (!data.getVitalById) {
      return res.status(404).json({ error: "Vital sign not found" });
    }

    // Return the vital sign
    res.status(200).json(data.getVitalById);
  } catch (error) {
    console.error("Error fetching vital sign:", error);
    res.status(500).json({ error: "Failed to fetch vital sign" });
  }
});

// Define a route for getting all vitals
app.get("/vital/all", async (req, res) => {
  try {
    const allVitals = await Vital.find();
    res.status(200).json(allVitals);
  } catch (error) {
    console.error("Error fetching vitals:", error);
    res.status(500).json({ error: "Failed to fetch vitals" });
  }
});

// Define a route for creating a new vital sign
app.post("/vital/create", async (req, res) => {
  try {
    const {
      patient,
      timestamp,
      heartRate,
      bloodPressure,
      temperature,
      respiratoryRate,
    } = req.body;

    // Execute the addVital mutation
    const { data, errors } = await graphql(
      schema,
      `
        mutation AddVital(
          $patient: String!
          $timestamp: Date!
          $heartRate: Int!
          $bloodPressure: String!
          $temperature: Float!
          $respiratoryRate: Int!
        ) {
          addVital(
            patient: $patient
            timestamp: $timestamp
            heartRate: $heartRate
            bloodPressure: $bloodPressure
            temperature: $temperature
            respiratoryRate: $respiratoryRate
          ) {
            id
            patient
            timestamp
            heartRate
            bloodPressure
            temperature
            respiratoryRate
          }
        }
      `,
      null,
      { req, res },
      {
        patient,
        timestamp,
        heartRate: parseInt(heartRate),
        bloodPressure,
        temperature: parseFloat(temperature),
        respiratoryRate: parseInt(respiratoryRate),
      }
    );

    // Check for errors
    if (errors) {
      console.error("Error creating vital sign:", errors);
      return res.status(500).json({ error: "Failed to create vital sign" });
    }

    // Return the newly created vital sign
    res.status(201).json(data.addVital);
  } catch (error) {
    console.error("Error creating vital sign:", error);
    res.status(500).json({ error: "Failed to create vital sign" });
  }
});

// Define a route for updating an existing vital sign
app.post("/vital/update/:id", async (req, res) => {
  try {
    const vitalId = req.params.id;
    const {
      timestamp,
      heartRate,
      bloodPressure,
      temperature,
      respiratoryRate,
    } = req.body;

    // Find the vital sign by ID
    const existingVital = await Vital.findById(vitalId);

    // If vital sign not found, return error
    if (!existingVital) {
      return res.status(404).json({ error: "Vital sign not found" });
    }

    // Update the vital sign fields
    existingVital.timestamp = timestamp || existingVital.timestamp;
    existingVital.heartRate = heartRate || existingVital.heartRate;
    existingVital.bloodPressure = bloodPressure || existingVital.bloodPressure;
    existingVital.temperature = temperature || existingVital.temperature;
    existingVital.respiratoryRate =
      respiratoryRate || existingVital.respiratoryRate;

    // Save the updated vital sign
    await existingVital.save();

    // Return the updated vital sign
    res.status(200).json(existingVital);
  } catch (error) {
    console.error("Error updating vital sign:", error);
    res.status(500).json({ error: "Failed to update vital sign" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Vital Microservice listening on port ${port}`);
});
