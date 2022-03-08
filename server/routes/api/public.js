let router = require("express").Router();

let { OkResponse, BadRequestResponse, UnauthorizedResponse } = require("express-http-response");

const auth = require("../auth");

const School = require("../../models/School");
const User = require("../../models/User");

// View All Schools
router.get("/get/schools", (req, res, next) => {
	School.find({ status: 1 }, { slug: 1, name: 1 })
		.then((schools) => next(new OkResponse(schools)))
		.catch((err) => next(new BadRequestResponse(err), 500));
});

module.exports = router;
