const mongoose = require("mongoose");

// Define the Vital schema
const VitalSchema = new mongoose.Schema({
  patient: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  heartRate: {
    type: Number,
    required: true,
  },
  bloodPressure: {
    type: String,
    required: true,
  },
  temperature: {
    type: Number,
    required: true,
  },
  respiratoryRate: {
    type: Number,
    required: true,
  },
});

// Create a Vital model
const Vital = mongoose.model("Vital", VitalSchema);

module.exports = Vital;
