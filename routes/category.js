const router = require("express").Router();
const categoryController = require("../controller/category");
const { auth } = require("../middlewares/apikeyAuth");

router.get("/",auth,  categoryController.getCategories);

module.exports = router;
