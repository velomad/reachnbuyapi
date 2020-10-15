const paginate = (data) => {
	return async (req, res, next) => {
		const page = parseInt(req.query.page);
		const limit = parseInt(req.query.limit);

		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;

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
		try {
			results.results = await data.find().limit(limit).skip(startIndex).exec();
			res.paginated = results;
			next();
		} catch (e) {
			console.error(e);
		}
	};
};

module.exports = paginate;
