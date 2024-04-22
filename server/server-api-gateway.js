// Load the module dependencies
const config = require("./config/config.js");
const express = require("express");
const morgan = require("morgan");
const compress = require("compression");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const configureMongoose = require("./config/mongoose.js");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const axios = require("axios");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphql/UserSchemas.js");

// Define the environment explicitly
const environment = "development";

// Create database instance
const db = configureMongoose();

// Create a new express application instance
const app = express();

// Environment variable to activate the 'morgan' logger or 'compress' middleware
if (environment === "development") {
  app.use(morgan("dev"));
} else if (environment === "vitalion") {
  app.use(compress());
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(methodOverride());
app.use(methodOverride("_method"));

// Configure CORS for both origins
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(
  cors({
    origin: ["http://localhost:3000"],
    origin: ["http://localhost:3003"],
    origin: ["http://localhost:5000"],
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

// Configure the 'session' middleware
app.use(
  session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret,
  })
);

// Set the application view engine and 'views' folder
app.set("views", "./app/views");
app.set("view engine", "ejs");

// Configure static file serving
app.use(express.static("./public"));

// Define API Gateway routes
const serviceEndpoints = {
  "Vital Microservice": "http://localhost:3002",
  "User Microservice": "http://localhost:3003",
  "Daily Motivation Microservice": "http://localhost:3004",
  "Emergency Alert Microservice": "http://localhost:3005",
};

// Endpoint for checking token validity
app.post("/auth/checkToken", async (req, res) => {
  try {
    const { token } = req.body;

    if (token == undefined) return; /** console.log("Token is invalid"); **/

    if (token == "null") return; /** console.log("Token is invalid"); **/

    // Forward request to user microservice
    const userResponse = await axios.post(
      `${serviceEndpoints["User Microservice"]}/auth/checkToken`,
      { token }
    );

    console.log(userResponse.data);
    res.send(userResponse.data);
  } catch (error) {
    console.error("Error checking token validity:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint for user authentication
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Forward request to auth/login microservice
    const userResponse = await axios.post(
      `${serviceEndpoints["User Microservice"]}/auth/login`,
      { email, password }
    );

    res.send(userResponse.data);
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint for user creation
app.post("/user/create", async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    // Forward request to user/create microservice
    const userResponse = await axios.post(
      `${serviceEndpoints["User Microservice"]}/user/create`,
      { userName, email, password }
    );

    res.send(userResponse.data);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint for user logout
app.post("/user/logout", async (req, res) => {
  try {
    // Forward request to user/logout microservice
    const userResponse = await axios.post(
      `${serviceEndpoints["User Microservice"]}/user/logout`
    );

    res.send(userResponse.data);
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint for getting a single vital record by ID
app.get("/vital/:id", async (req, res) => {
  try {
    const vitalId = req.params.id;

    // Forward request to vital microservice
    const vitalResponse = await axios.get(
      `${serviceEndpoints["Vital Microservice"]}/vital/${vitalId}`
    );

    res.send(vitalResponse.data);
  } catch (error) {
    console.error("Error getting vital:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint for getting all vitals
app.get("/vital/all", async (req, res) => {
  try {
    const vitalResponse = await axios.get(
      `${serviceEndpoints["Vital Microservice"]}/vital/all`
    );

    res.send(vitalResponse.data);
    // console.log(vitalResponse.data);
  } catch (error) {
    console.error("Error getting all vitals:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint for creating a vital
app.post("/vital/create", async (req, res) => {
  try {
    const vitalData = req.body;

    // Forward request to vital/create microservice
    const vitalResponse = await axios.post(
      `${serviceEndpoints["Vital Microservice"]}/vital/create`,
      vitalData
    );

    res.send(vitalResponse.data);
  } catch (error) {
    console.error("Error creating vital:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint for updating a vital
app.post("/vital/update/:id", async (req, res) => {
  try {
    const vitalId = req.params.id;
    const vitalData = req.body;

    // Forward request to vital/update microservice
    const vitalResponse = await axios.post(
      `${serviceEndpoints["Vital Microservice"]}/vital/update/${vitalId}`,
      vitalData
    );

    res.send(vitalResponse.data);
  } catch (error) {
    console.error("Error updating vital:", error);
    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else {
      res.status(500).send("Internal Server Error");
    }
  }
});

// Endpoint for getting all daily motivations
app.get("/daily-motivation/all", async (req, res) => {
  try {
    const dailyResponse = await axios.get(
      `${serviceEndpoints["Daily Motivation Microservice"]}/daily-motivation/all`
    );

    res.send(dailyResponse.data);
  } catch (error) {
    console.error("Error getting all vitals:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint for creating an emergency alert
app.post("/daily-motivation/create", async (req, res) => {
  try {
    const dailyData = req.body;

    // Forward request to emergency-alert/create microservice
    const dailyResponse = await axios.post(
      `${serviceEndpoints["Daily Motivation Microservice"]}/daily-motivation/create`,
      dailyData
    );

    res.send(dailyResponse.data);
  } catch (error) {
    console.error("Error creating daily motivation:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint for getting all emergency alert
app.get("/emergency-alert/all", async (req, res) => {
  try {
    const alertResponse = await axios.get(
      `${serviceEndpoints["Emergency Alert Microservice"]}/emergency-alert/all`
    );

    res.send(alertResponse.data);
  } catch (error) {
    console.error("Error getting all alerts:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint for creating an emergency alert
app.post("/emergency-alert/create", async (req, res) => {
  try {
    const alertData = req.body;

    // Forward request to emergency-alert/create microservice
    const alertResponse = await axios.post(
      `${serviceEndpoints["Emergency Alert Microservice"]}/emergency-alert/create`,
      alertData
    );

    res.send(alertResponse.data);
  } catch (error) {
    console.error("Error creating emergency alert:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Configure GraphQL endpoint
app.use(
  "/graphql",
  graphqlHTTP((request, response) => {
    return {
      schema: schema,
      rootValue: global,
      graphiql: true,
      context: {
        req: request,
        res: response,
      },
    };
  })
);

// Start both servers
const port = 3000;
const portGraphQL = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`API Gateway listening on http://localhost:${port}`);
});

app.listen(portGraphQL, () => {
  console.log(
    `GraphQL Server is running on http://localhost:${portGraphQL}/graphql`
  );
});
