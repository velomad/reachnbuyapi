// const { MongoClient } = require("mongodb");
// const mongoose = require("mongoose");

// const paginate = (model) => {
// 	return async (req, res, next) => {
// 		const page = parseInt(req.query.page);
// 		const limit = parseInt(req.query.limit);

// 		const startIndex = (page - 1) * limit;
// 		const endIndex = page * limit;

// 		const results = {};

// 		if (endIndex < model.length) {
// 			results.next = {
// 				page: page + 1,
// 				limit: limit,
// 			};
// 		}
// 		if (startIndex > 0) {
// 			results.previous = {
// 				page: page - 1,
// 				limit: limit,
// 			};
//         }
//         try{
//             results.results = await model.find().limit(limit).skip(startIndex).exec()
//             res.paginated = results
//             next()
//         }catch(e) {
//             console.error(e)
//         }
// 	};
// };

// module.exports = paginate;
