const router = require("express").Router();
const autocompleteController = require("../controller/autocomplete");

router.get("/search", autocompleteController.autocomplete);

module.exports = router;
