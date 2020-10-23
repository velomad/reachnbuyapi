const { MongoClient } = require("mongodb");
const URI = process.env.MONGODB_LOCAL_URI;

module.exports = {
	filterProducts: async (req, res) => {
		const client = new MongoClient(URI, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		});

		try {
			await client.connect();

			const database = client.db("webscrape");
			const collection = database.collection("products");

			const item = req.query.term.replace(/\s/g, "-");

			const page = parseInt(req.query.page);
			const limit = parseInt(req.query.limit);
			const startIndex = (page - 1) * limit;
			const endIndex = page * limit;

			// let documentLength = await collection.countDocuments({
			// 	category: item.toLowerCase(),
			// });

			const results = {};

			if (endIndex < 1000) {
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

			results.result = await collection
				.aggregate([
					{
						$search: {
							autocomplete: {
								query: `${req.query.term}`,
								path: "displayCategory",
								fuzzy: {
									maxEdits: 1,
								},
							},
						},
					},
					{
						$limit: 1000,
					},
				])
				.skip(startIndex)
				.limit(limit)
				.toArray();

			res.status(200).json({
				requestedURL: item,
				totalProducts: 1000,
				totalProducts: results.result.length,
				totalPages: Math.ceil(1000 / limit),
				totalPages: Math.ceil(results.result.length / limit),
				maxLimit: 50,
				message: results.result.length < 1 ? "not found" : item,
				results: results.result.length,
				data: results,
			});
			console.log("result", results);
		} catch (e) {
			console.error(e);
		}
		await client.close();
	},
};
