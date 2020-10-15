const { MongoClient } = require("mongodb");

module.exports = {
	getTopWear: async (req, res) => {
		const client = new MongoClient(process.env.MONGODB_LOCAL_URI, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		});

		const page = parseInt(req.query.page);
		const limit = parseInt(req.query.limit);

		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;

		const results = {};

		// if (limit > results.results.length) {
		// 	results.next = {
		// 		page: page + 1,
		// 		limit: limit,
		// 	};
		// }
		// if (startIndex > 0) {
		// 	results.previous = {
		// 		page: page - 1,
		// 		limit: limit,
		// 	};
		// }

		try {
			await client.connect();

			const database = client.db("myntra");
			const collection = database.collection(req.query.item);
			// const items = await collection.find().toArray();
			results.results = await collection
				.find()
				.limit(limit)
				.skip(startIndex)
				.toArray();

			if (limit > results.results.length) {
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

			res.status(200).json({
				requestedURL: req.query.item,
				message: "categories",
				results: results.length,
				data: results,
			});
			console.log(results);
			console.log(results.results.length);
			await client.close();
		} catch (e) {
			console.error(e);
		}
	},
};
