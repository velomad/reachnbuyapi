const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const connectDB = require("./config/db");

require("dotenv").config();

// Init express server
const app = express();

// Connect to MongoDB
connectDB();

// Middlewares & configs setup
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.disable("x-powered-by");
app.use(cors());

// api routes
app.use("/api/v1/products", require("./routes/product"));
app.use("/api/v1/products", require("./routes/autocomplete"));

const port = process.env.PORT || 5000;
const address = process.env.SERVER_ADDRESS || "localhost";

app.listen(port, () => {
	console.log(`Server running on http://${address}:${port}`);
});
