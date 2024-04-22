const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const queryType = require("../graphql/dailyMotivationSchemas.js").queryType;
const mutation = require("../graphql/dailyMotivationSchemas.js").mutation;
const { schema } = require("../graphql/dailyMotivationSchemas.js").schema;

const configureMongoose = require("../config/mongoose.js");
const DailyMotivation = require("../models/DailyMotivation.js");

// Create database instance
const db = configureMongoose();

// Initialize express app
const app = express();
const port = 3004;

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

// Define a route for getting a daily motivation by ID
app.get("/api/daily-motivation/:id", async (req, res) => {
  try {
    const motivationId = req.params.id;

    // Retrieve daily motivation from the database
    const dailyMotivation = await DailyMotivation.findById(motivationId);

    // Check if daily motivation exists
    if (!dailyMotivation) {
      return res.status(404).json({ error: "Daily motivation not found" });
    }

    // Return the daily motivation
    res.status(200).json(dailyMotivation);
  } catch (error) {
    console.error("Error fetching daily motivation:", error);
    res.status(500).json({ error: "Failed to fetch daily motivation" });
  }
});

// Define a route for getting all daily motivations
app.get("/daily-motivation/all", async (req, res) => {
  try {
    const allMotivations = await DailyMotivation.find();
    res.status(200).json(allMotivations);
  } catch (error) {
    console.error("Error fetching daily motivations:", error);
    res.status(500).json({ error: "Failed to fetch daily motivations" });
  }
});

// Define a route for creating a new daily motivation
app.post("/daily-motivation/create", async (req, res) => {
  try {
    const { message, author } = req.body;

    const currentDate = new Date();
    const formattedDateTime = currentDate.toISOString();

    // Create a new daily motivation instance
    const newMotivation = new DailyMotivation({
      message,
      author,
      createdAt: `${formattedDateTime}`,
    });

    // Save the new daily motivation to the database
    const savedMotivation = await newMotivation.save();

    // Return the newly created daily motivation
    res.status(201).json(savedMotivation);
  } catch (error) {
    console.error("Error creating daily motivation:", error);
    res.status(500).json({ error: "Failed to create daily motivation" });
  }
});

// Define a route for updating an existing daily motivation
app.put("/daily-motivation/update/:id", async (req, res) => {
  try {
    const motivationId = req.params.id;
    const { message } = req.body;

    // Find the daily motivation by ID
    const existingMotivation = await DailyMotivation.findById(motivationId);

    // If daily motivation not found, return error
    if (!existingMotivation) {
      return res.status(404).json({ error: "Daily motivation not found" });
    }

    // Update the daily motivation message
    existingMotivation.message = message || existingMotivation.message;

    // Save the updated daily motivation
    await existingMotivation.save();

    // Return the updated daily motivation
    res.status(200).json(existingMotivation);
  } catch (error) {
    console.error("Error updating daily motivation:", error);
    res.status(500).json({ error: "Failed to update daily motivation" });
  }
});

// Define a route for deleting a daily motivation
app.delete("/daily-motivation/delete/:id", async (req, res) => {
  try {
    const motivationId = req.params.id;

    // Delete the daily motivation from the database
    await DailyMotivation.findByIdAndDelete(motivationId);

    // Return success message
    res.status(200).json({ message: "Daily motivation deleted successfully" });
  } catch (error) {
    console.error("Error deleting daily motivation:", error);
    res.status(500).json({ error: "Failed to delete daily motivation" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Daily Motivation Microservice listening on port ${port}`);
});
