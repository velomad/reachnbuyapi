const { MongoClient } = require("mongodb");
const URI = process.env.MONGODB_LOCAL_URI;

module.exports = {
	autocomplete: async (req, res) => {
		try {
			const collection = req.app.locals.db.db.collection('autocomplete');
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

			var test = [];
			result.map((el) => {
				test.push(el.category);
			});

			res.json({
				"search term": req.query.term,
				results: result.length,
				suggestions: test,
			});
		} catch (e) {
			console.error(e);
			res.status(500).json({
				message: e.message,
			});
		} finally {
			
		}
	},
};
