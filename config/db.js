const { MongoClient } = require("mongodb");
const connectDB = async () => {
	MongoClient.connect(process.env.MONGODB_LOCAL_URI, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
	})
		.then(() => {
			console.log("connected to db");
		})
		.catch((e) => {
			console.log("error");
		});
};

module.exports = connectDB;
