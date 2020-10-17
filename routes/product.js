const router = require("express").Router();
const myntraController = require("../controller/product");

router.get("/:website", myntraController.getTopWear);

module.exports = router;
