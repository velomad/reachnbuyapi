const { MongoClient } = require("mongodb");
const { endianness } = require("os");
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

			const item = req.query.term;

			const page = parseInt(req.query.page);
			const limit = parseInt(req.query.limit);
			const startIndex = (page - 1) * limit;
			const endIndex = page * limit;

			let data = await collection
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
						$project: {
							_id: 0,
						},
					},
					{
						$limit: 1000,
					},
				])
				.sort({ productName: 1 })
				.toArray();

			const results = {};

			if (endIndex < data.length) {
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

			results.result = data.slice(startIndex, endIndex);

			if (!limit) {
				return res.status(404).json({
					message: "missing query param limit",
				});
			}

			res.status(200).json({
				"search term": item,
				totalProducts: data.length,
				totalPages: Math.ceil(data.length / limit),
				maxLimit: 50,
				message: results.result.length < 1 ? "not found" : "Results found",
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
