const router = require("express").Router();
const myntraController = require("../controller/myntra");

router.get("/", myntraController.getTopWear);

module.exports = router;
