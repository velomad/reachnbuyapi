const mongoose = require("mongoose");
const Schema = mongoose.Schema;

function dynamicSchema(collectionName) {
	var myntraSchema = new Schema({
		imageUrl: {
			type: String,
		},
		productPrice: {
			type: Number,
		},
		productStrike: {
			type: String,
		},
		productDiscount: {
			type: String,
		},
		productLink: {
			type: String,
		},
		brandName: {
			type: String,
		},
		productName: {
			type: String,
		},
		productSizes: {
			type: Array,
		},
	});

	mongoose.models = {};

	const myDB = mongoose.connection.useDb("myntra");

	return myDB.model("myntra", myntraSchema, collectionName);
}

//no we export dynamicSchema function
module.exports = dynamicSchema;
