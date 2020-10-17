const { MongoClient } = require("mongodb");
const URL = process.env.MONGODB_LOCAL_URI;

var db
module.exports = {
	connectToServer: async (cb) => {
		MongoClient.connect(URL, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		}, (err,client) => {
            db = client.db("webscrape")
            return cb(err)
        });
	},

	getDb: () => {
		return db
	},
};
