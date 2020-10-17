const { MongoClient } = require("mongodb");
const URI = process.env.MONGODB_LOCAL_URI;

module.exports = {
	getTopWear: async (req, res) => {
		const client = new MongoClient(URI, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		});

		try {
			await client.connect();

			const database = client.db("webscrape");
			const collection = database.collection("products");

			const page = parseInt(req.query.page);
			const limit =
				parseInt(req.query.limit) > 50 ? 50 : parseInt(req.query.limit);
			const startIndex = (page - 1) * limit;
			const endIndex = page * limit;

			let documentLength = await collection.countDocuments();

			const results = {};

			if (endIndex < documentLength) {
				results.next = {
					page: page + 1,
					limit: limit,
				};
			}
			if (startIndex > 0) {
				results.previous = {
					page: page - 1,
					limit: limit,
				};
			}

			const item = req.query.item;
			results.result = await collection
				.find({
					website: "ajio",
					category: item,
				})
				.limit(limit)
				.skip(startIndex)
				.toArray();

			res.status(200).json({
				requestedURL: item,
				message: results.result.length < 1 ? "not found" : item,
				results: results.result.length,
				data: results,
			});
			console.log(results);
			console.log(results.result.length);
		} catch (e) {
			console.error(e);
		}
		await client.close();
	},
};
