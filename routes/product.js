const router = require("express").Router();
const myntraController = require("../controller/product");
const { auth } = require("../middlewares/apikeyAuth");

router.get("/",myntraController.getTopWear);

module.exports = router;
