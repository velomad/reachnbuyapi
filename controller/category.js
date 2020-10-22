const { MongoClient } = require("mongodb");
const URI = process.env.MONGODB_LOCAL_URI;

module.exports = {
	getCategories: async (req, res) => {
		const client = new MongoClient(URI, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		});

		try {
			await client.connect();
			const database = client.db("webscrape");
			const collection = database.collection("categories");

			const result = await collection.find().toArray();

			res.json({
				result: result,
			});
		} catch (e) {
			console.error(e);
			res.status(500).json({
				message: e.message,
			});
		}
		await client.close();
	},
};
