const { MongoClient } = require("mongodb");
const URI = process.env.MONGODB_LOCAL_URI;

module.exports = {
	autocomplete: async (req, res) => {
		const client = new MongoClient(process.env.MONGODB_LOCAL_URI, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		});

		try {
			await client.connect();
			const database = client.db("webscrape");
			// const collection = database.collection("products");
			const collection = database.collection("category");

			let result = await collection
				.aggregate([
					{
						$search: {
							autocomplete: {
								query: `${req.query.term}`,
								path: "category",
								fuzzy: {
									maxEdits: 1,
								},
							},
						},
					},
				])
				.toArray();

			res.json({
				"search term": req.query.term,
				results: result.length,
				data: result,
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
