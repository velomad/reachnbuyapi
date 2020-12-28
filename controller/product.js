const { match } = require("assert");
const { MongoClient } = require("mongodb");
const URI = process.env.MONGODB_LOCAL_URI;

module.exports = {
	getTopWear: async (req, res) => {
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

			const page = parseInt(req.query.page);
			const limit =
				parseInt(req.query.limit) > 50 ? 50 : parseInt(req.query.limit);
			const startIndex = (page - 1) * limit;
			const endIndex = page * limit;

			console.log(req.query);

			const queryObj = { ...req.query };
			const excludedFields = ["page", "sort", "limit", "fields", "api_key"];
			excludedFields.forEach((el) => delete queryObj[el]);

			// 2.advance filtering
			let queryStr = JSON.stringify(queryObj);
			queryStr = queryStr.replace(
				/\b(gte|gt|lte|lt)\b/g,
				(match) => `$${match}`,
			);

			// queryStr = queryStr.replace(
			// 	/\b(1|2|5|6)\b/g,
			// 	(match) => `${Number(match)}`,
			// );

			console.log("unnnpareddd querystring=============>", queryStr);
			console.log(JSON.parse(queryStr));

			let query = collection
				.find(JSON.parse(queryStr))
				.sort(
					req.query.sort === "discount"
						? { discountPercent: -1 }
						: req.query.sort === "high"
						? { productPrice: -1 }
						: req.query.sort === "low"
						? { productPrice: 1 }
						: req.query.sort === "rating"
						? { productRating: -1 }
						: null,
				)
				.collation({ locale: "en_US", numericOrdering: true })
				.limit(limit)
				.skip(startIndex)
				.toArray();

			// execute query

			let enteredQuery = JSON.stringify(queryObj);
			const replacedQuery = JSON.parse(
				enteredQuery.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`),
			);

			const results = {};

			console.log(replacedQuery);
			let documentLength = await collection.countDocuments(replacedQuery);

			results.result = await query;

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

			res.status(200).json({
				category: req.query.category,
				totalProducts: documentLength,
				totalPages: Math.ceil(documentLength / limit),
				maxLimit: 50,
				results: results.result.length,
				data: results,
			});
		} catch (e) {
			console.error(e);
		}
		finally{
			await client.close();
		}
	},
};

// { website: 'ajio', gender: 'men', discountPercent: { $gte: '10' } }
// { website: 'ajio', gender: 'men', discountPercent: { '$gte': '10' } }
