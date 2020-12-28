const { MongoClient } = require("mongodb");
const URI = process.env.MONGODB_LOCAL_URI;

module.exports = {
	filterProducts: async (req, res) => {
		const client = new MongoClient(URI, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
			maxPoolSize: 30,
			keepAlive: 0,
			tls: true,
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

			let aggregatedQueries = [
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
			];

			const queryObj = { ...req.query };
			const excludedFields = [
				"page",
				"sort",
				"limit",
				"fields",
				"api_key",
				"term",
			];
			excludedFields.forEach((el) => delete queryObj[el]);

			let enteredQuery = JSON.stringify(queryObj);
			const replacedQuery = JSON.parse(
				enteredQuery.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`),
			);

			console.log(JSON.stringify(Object.keys(replacedQuery)).slice(1, -1));

			if (
				!aggregatedQueries.includes(
					JSON.stringify(Object.keys(replacedQuery)).slice(1, -1),
				)
			) {
				aggregatedQueries.push({ $match: replacedQuery });
			}

			if (req.query.sort === "discount") {
				aggregatedQueries.push({ $sort: { discountPercent: -1 } });
			} else if (req.query.sort === "high") {
				aggregatedQueries.push({ $sort: { productPrice: -1 } });
			} else if (req.query.sort === "low") {
				aggregatedQueries.push({ $sort: { productPrice: 1 } });
			} else if (req.query.sort === "rating") {
				aggregatedQueries.push({ $sort: { productRating: -1 } });
			}

			let data = await collection
				.aggregate(aggregatedQueries, {
					collation: { locale: "en_US", numericOrdering: true },
				})
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

			res.status(200).json({
				"search term": item,
				totalProducts: data.length,
				totalPages: Math.ceil(data.length / limit),
				maxLimit: 50,
				message: results.result.length < 1 ? "not found" : "Results found",
				results: results.result.length,
				data: results,
			});
			// console.log("result", results);
		} catch (e) {
			console.error(e);
		} finally {
			await client.close();
		}
	},
};
