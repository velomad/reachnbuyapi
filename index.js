const express = require("express");
const {MongoClient} = require("mongodb");
const mongoose = require("mongoose");
const cors = require("cors");
const logger = require("morgan");
const dotenv = require("dotenv");
const expressStatusMonitor = require("express-status-monitor");
const connectDB = require("./config/db");

require("dotenv").config();

// Init express server
const app = express();

// Connect to MongoDB
// connectDB();
mongoose.connect(process.env.MONGODB_LOCAL_URI, {
	useUnifiedTopology: true,
	useNewUrlParser: true,
}).then(() => {
	console.log("connected to db")
})

// Middlewares & configs setup
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.disable("x-powered-by");
app.use(expressStatusMonitor());
app.use(cors());

// api routes
app.use("/api/v1/myntra", require("./routes/myntra"));

const port = process.env.PORT || 5000;
const address = process.env.SERVER_ADDRESS || "localhost";

app.listen(port, () => {
	console.log(`Server running on http://${address}:${port}`);
});
