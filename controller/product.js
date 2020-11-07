const { match } = require("assert");
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

			const database = client.db("webscrapebackup");
			const collection = database.collection("products");

			const page = parseInt(req.query.page);
			const limit =
				parseInt(req.query.limit) > 50 ? 50 : parseInt(req.query.limit);
			const startIndex = (page - 1) * limit;
			const endIndex = page * limit;

			console.log(req.query);

			const queryObj = { ...req.query };
			const excludedFields = ["page", "sort", "limit", "fields"]; 
			excludedFields.forEach((el) => delete queryObj[el]);

			// 2.advance filtering
			let queryStr = JSON.stringify(queryObj);
			queryStr = queryStr.replace(
				/\b(gte|gt|lte|lt)\b/g,
				(match) => `$${match}`,
			);


				

			let query = collection
				.find(JSON.parse(queryStr))
				.sort(
					req.query.sort === "discount"
						? { discountPercent: -1 }
						: req.query.sort === "high"
						? { productPrice: -1 }
						: req.query.sort === "low"
						? { productPrice: 1 }
						: null,
				)
				.limit(limit)
				.skip(startIndex)
				.toArray();

			// execute query

			// queryStr.replace(/\b(gte|gt|lte|lt)\b/g,(match) => `$${match}`)
			
			var enteredQuery = JSON.stringify(queryObj)
			var replacedQuery = JSON.parse(enteredQuery.replace(/\b(gte|gt|lte|lt)\b/g,(match) => `$${match}`))
			const results = {};
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

			// if (!item) {
			// 	return res.status(404).json({
			// 		message: "missing query param category",
			// 	});
			// }

			// const query = (results.result = await collection
			// 	.find({
			// 		website: website,
			// 		category: item,
			// 		// discountPercent: {  $gte:  1 === 1 ? 70 : 0   }  ,
			// 	})
			// 	.filter({
			// 		discountPercent: { $gte: 75 },
			// 	})
			// 	.sort(
			// 		req.query.sort === "discount"
			// 			? { discountPercent: -1 }
			// 			: req.query.sort === "high"
			// 			? { productPrice: -1 }
			// 			: req.query.sort === "low"
			// 			? { productPrice: 1 }
			// 			: null,
			// 	)
			// 	.limit(limit)
			// 	.skip(startIndex)
			// 	.toArray());


			console.log("querystrijng", JSON.parse(queryStr));
			console.log("query",query);
			console.log("queryobj",queryObj);

			res.status(200).json({
				category: req.query.category,
				totalProducts: documentLength,
				totalPages: Math.ceil(documentLength / limit),
				maxLimit: 50,
				// message: result.length < 1 ? "not found" : null,
				results: results.result.length,
				data:  results ,
			});
			// console.log(results);
			// console.log(results.result.length);
		} catch (e) {
			console.error(e);
		}
		await client.close();
	},
};







// { website: 'ajio', gender: 'men', discountPercent: { $gte: '10' } }
// { website: 'ajio', gender: 'men', discountPercent: { '$gte': '10' } }