const express = require('express');
const router = express.Router();

const controller = require("../controllers/controller");

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.route("/")
    .post(controller.runComputer)

module.exports = router;
