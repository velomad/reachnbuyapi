// const mongoose = require("mongoose");
// const chalk = require("chalk");

// const connectDB = async () => {
// 	try {
// 		// MongoDB setup.
// 		mongoose.set("useFindAndModify", false);
// 		mongoose.set("useCreateIndex", true);
// 		mongoose.set("useNewUrlParser", true);
// 		mongoose.set("useUnifiedTopology", true);
// 		var URI;
// 		if (process.env.NODE_ENV === "production") {
// 			URI = process.env.MONGODB_URI;
// 		} else {
// 			URI = process.env.MONGODB_LOCAL_URI;
// 		}
// 		await mongoose.connect(URI);
// 		if (process.env.NODE_ENV === "production") {
// 			console.log("connected to MONGO");
// 		} else {
// 			console.log("connected to local mongoDB");
// 		}
// 	} catch (e) {
// 		console.error(e.message);
// 		console.log(
// 			"%s MongoDB connection error. Please make sure MongoDB is running.",
// 			chalk.red("✗"),
// 		);
// 		// Exit process with failure
// 		process.exit(1);
// 	}
// };

// module.exports = connectDB;

