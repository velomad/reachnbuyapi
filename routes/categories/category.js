const router = require("express").Router();
const categoryController = require("../../controller/categories/category");

router.get("/categories", categoryController.getCategories);

module.exports = router;
