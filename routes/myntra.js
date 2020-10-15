const router = require("express").Router();
const myntraController = require("../controller/myntra");
const dynamicSchema = require("../models/myntra");
const paginate = require("../middlewares/pagination");

router.get("/", myntraController.getTopWear);

module.exports = router;
