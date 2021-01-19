const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const connectDB = require("./config/db");
const MongoClient = require('mongodb').MongoClient;
require("dotenv").config();

// Init express server
const app = express();

// Connect to MongoDB
// connectDB();

// Middlewares & configs setup
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.disable("x-powered-by");
app.use(cors());

// api routes
app.use("/api/v1/products", require("./routes/product"));
app.use("/api/v1/product", require("./routes/singleProduct"));
app.use("/api/v1/search", require("./routes/autocomplete"));
app.use("/api/v1/items", require("./routes/searchProducts"));
app.use("/api/v1/categories", require("./routes/category"));

const port = process.env.PORT || 8080;
const address = process.env.SERVER_ADDRESS || "localhost";

// app.listen(port, () => {
// 	console.log(`Server running on http://${address}:${port}`);
// });

let db;
let dbClient;

MongoClient.connect(process.env.MONGODB_LOCAL_URI, { useNewUrlParser: true, useUnifiedTopology: true, poolSize: 1 })
	.then(client => {
		db = client.db('webscrape');
		const products_collection = db.collection('products');
		app.locals.products_collection = products_collection;
		dbClient = client;
		app.listen(port, () => console.info(`REST API running on port ${port}`));
	}).catch(error => console.error(error));

process.on('SIGINT', () => {
	dbClient.close();
	process.exit();
});
