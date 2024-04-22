const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const queryType = require("../graphql/emergencyAlertSchemas.js").queryType;
const mutation = require("../graphql/emergencyAlertSchemas.js").mutation;
const { schema } = require("../graphql/emergencyAlertSchemas.js").schema;

const configureMongoose = require("../config/mongoose.js");
const EmergencyAlert = require("../models/EmergencyAlert.js");

// Create database instance
const db = configureMongoose();

// Initialize express app
const app = express();
const port = 3005; 

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

// Define a route for getting a emergency alert by ID
app.get("/api/emergency-alert/:id", async (req, res) => {
  try {
    const emergencyId = req.params.id;

    // Retrieve emergency alert from the database
    const EmergencyAlert = await EmergencyAlert.findById(emergencyId);

    // Check if emergency alert exists
    if (!EmergencyAlert) {
      return res.status(404).json({ error: "emergency alert not found" });
    }

    // Return the emergency alert
    res.status(200).json(EmergencyAlert);
  } catch (error) {
    console.error("Error fetching emergency alert:", error);
    res.status(500).json({ error: "Failed to fetch emergency alert" });
  }
});

// Define a route for getting all emergency alerts
app.get("/emergency-alert/all", async (req, res) => {
  try {
    const allEmergencys = await EmergencyAlert.find();
    res.status(200).json(allEmergencys);
  } catch (error) {
    console.error("Error fetching emergency alerts:", error);
    res.status(500).json({ error: "Failed to fetch emergency alerts" });
  }
});

// Define a route for creating a new emergency alert
app.post("/emergency-alert/create", async (req, res) => {
  try {
    const { patient, message } = req.body;

    const currentDate = new Date();
    const formattedDateTime = currentDate.toISOString();

    // Create a new emergency alert instance
    const newEmergency = new EmergencyAlert({
      patient,
      message,
      createdAt: `${formattedDateTime}`,
    });

    // Save the new emergency alert to the database
    const savedEmergency = await newEmergency.save();

    // Return the newly created emergency alert
    res.status(201).json(savedEmergency);
  } catch (error) {
    console.error("Error creating emergency alert:", error);
    res.status(500).json({ error: "Failed to create emergency alert" });
  }
});

// Define a route for updating an existing emergency alert
app.put("/emergency-alert/update/:id", async (req, res) => {
  try {
    const emergencyId = req.params.id;
    const { message } = req.body;

    // Find the emergency alert by ID
    const existingEmergency = await EmergencyAlert.findById(emergencyId);

    // If emergency alert not found, return error
    if (!existingEmergency) {
      return res.status(404).json({ error: "Emergency alert not found" });
    }

    // Update the emergency alert message
    existingEmergency.message = message || existingEmergency.message;

    // Save the updated emergency alert
    await existingEmergency.save();

    // Return the updated emergency alert
    res.status(200).json(existingEmergency);
  } catch (error) {
    console.error("Error updating emergency alert:", error);
    res.status(500).json({ error: "Failed to update emergency alert" });
  }
});

// Define a route for deleting a emergency alert
app.delete("/emergency-alert/delete/:id", async (req, res) => {
  try {
    const emergencyId = req.params.id;

    // Delete the emergency alert from the database
    await EmergencyAlert.findByIdAndDelete(emergencyId);

    // Return success message
    res.status(200).json({ message: "Emergency alert deleted successfully" });
  } catch (error) {
    console.error("Error deleting emergency alert:", error);
    res.status(500).json({ error: "Failed to delete emergency alert" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Emergency Alert Microservice listening on port ${port}`);
});
