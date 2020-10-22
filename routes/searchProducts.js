const router = require("express").Router();
const searchController = require("../controller/searchProducts");
const { auth } = require("../middlewares/apikeyAuth");

router.get("/search",auth, searchController.filterProducts);

module.exports = router;
