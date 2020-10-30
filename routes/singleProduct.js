const router = require("express").Router();
const singleProductController = require("../controller/singleProduct");
const { auth } = require("../middlewares/apikeyAuth");

router.get("/",auth, singleProductController.product);

module.exports = router;
