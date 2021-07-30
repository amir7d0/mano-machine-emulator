const express = require('express');
const router = express.Router();

const controller = require("../controllers/controller");

router.route("/")
    .post(controller.runComputer)

router.route("*")
    .get(controller.notFound)
    .post(controller.notFound)
    .put(controller.notFound)
    .delete(controller.notFound)

module.exports = router;
