const router = require("express").Router()
const myntraController = require("../../controller/myntra/topwear")

router.get("/t-shirt", myntraController.getTShirts)

module.exports = router


//    /api/v1/myntra/section?="topwear"&category?="t-shirt"&p=2
//    /api/v1/section/section?="topwear"&category?="t-shirt"