// const { MongoClient } = require("mongodb");
// const mongoose = require("mongoose");

// const myntraSchema = mongoose.Schema({
// 	productName: {
// 		type: String,
// 	},
// 	productLink: {
// 		type: String,
// 	},
// 	imageURL: {
// 		type: String,
// 	},
// 	price: {
// 		type: Number,
// 	},
// 	discountedPrice: {
// 		type: Number,
// 	},
// });

// // mongoose.connection.useDb("myntra")

// const myntraProduct = mongoose.model("myntraProduct", myntraSchema, "tshirt");

// module.exports = Myntra = mongoose.model("myntra", myntraSchema)

// module.exports = User = mongoose.model("UserDetails", UserSchema);

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// our schema

function dynamicSchema(collectionName) {
	var myntraSchema = new Schema({
		productName: {
			type: String,
		},
		productLink: {
			type: String,
		},
		imageURL: {
			type: String,
		},
		price: {
			type: Number,
		},
		discountedPrice: {
			type: Number,
		},
	});

	mongoose.models = {};

	const myDB = mongoose.connection.useDb("myntra")

	return myDB.model("myntra", myntraSchema, collectionName);
}

//no we export dynamicSchema function
module.exports = dynamicSchema;
