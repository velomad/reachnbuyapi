const dynamicSchema = require("../models/myntra");

module.exports = {
	getTopWear: async (req, res) => {
		const page = parseInt(req.query.page);
		const limit =
			parseInt(req.query.limit) > 50 ? 50 : parseInt(req.query.limit);
		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;
		console.log("endIndex", endIndex);

		let documentLength = await dynamicSchema(req.query.item).countDocuments();

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

		try {
			const item = req.query.item;
			results.results = await dynamicSchema(item)
				.find()
				.limit(limit)
				.skip(startIndex);

			res.status(200).json({
				requestedURL: req.query.item,
				message: results.results.length < 1 ? "not found" : "tshirts",
				results: results.results.length,
				data: results,
			});
			console.log(results);
			console.log(results.results.length);
		} catch (e) {
			console.error(e);
		}
	},
};
