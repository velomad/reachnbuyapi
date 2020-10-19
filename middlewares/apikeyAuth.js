const { MongoClient } = require("mongodb");
const URI = process.env.MONGODB_LOCAL_URI;

const auth = async (req, res, next) => {
	const client = new MongoClient(URI, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
	});

	try {
		await client.connect();
		const database = client.db("webscrape");
		const collection = database.collection("accounts");

		const apiKey = req.query.api_key;
		const result = await collection.findOne({
			api_key: apiKey,
		});
		if (!result) {
			res.status(401).json({
				message: "Invalid API Credentials",
				details: "Provided API credentials doesn't match",
			});
		}
	} catch (e) {
		res.status(500).json({
			message: e.message,
		});
	}
	next();
};
module.exports = { auth };
