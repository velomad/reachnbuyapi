
const router = require("express").Router();
const searchController = require("../controller/searchProducts");
const { auth } = require("../middlewares/apikeyAuth");

router.get("/search", searchController.filterProducts);

module.exports = router;
