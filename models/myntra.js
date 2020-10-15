const mongoose = require("mongoose");

const myntraSchema = mongoose.Schema({
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

const myntraProduct = mongoose.model("myntraProduct", myntraSchema, "bra");

module.exports = myntraProduct;
