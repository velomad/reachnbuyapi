const { MongoClient } = require("mongodb");
var ObjectId = require("mongodb").ObjectId;
const URI = process.env.MONGODB_LOCAL_URI;

module.exports = {
	product: async (req, res) => {
		const client = new MongoClient(URI, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		});

		try {
			await client.connect();

			const database = client.db("webscrape");
			const collection = database.collection("products");

			const id = req.query.id;
			console.log(id);
			let data = await collection.findOne({ _id: ObjectId(id) });

			res.status(200).json({
				result: data,
			});
			console.log("result", data);
		} catch (e) {
			console.error(e);
		}
		await client.close();
	},
};
