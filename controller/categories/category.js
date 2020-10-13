const { MongoClient } = require("mongodb");
const db = require("../../config/keys").mongoURI;

module.exports = {
	getCategories: (req, res) => {
		const client = new MongoClient(db, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		});

		async function run() {
			try {
				await client.connect();
				const database = client.db("categories");
				const collection = database.collection("category");

				const items = await collection.find().toArray();
				res.status(200).json({
					message: "categories",
					data: items,
				});
				console.log(items);
				await client.close();
			} catch (e) {
				console.log(e);
			}
		}
		run();
	},
};
