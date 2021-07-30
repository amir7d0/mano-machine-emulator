const express = require('express');
const router = express.Router();

const controller = require("../controllers/controller");

router.route("/")
    .post(controller.runComputer)

module.exports = router;
