let { BadRequestResponse, UnauthorizedResponse, ForbiddenResponse } = require("express-http-response");

function isBlocked(req, res, next) {
	if (+req.emailUser.status === 3) return next(new ForbiddenResponse("User Already Blocked"));
	next();
}

function isUnBlocked(req, res, next) {
	if (req.emailUser.status === 1) return next(new ForbiddenResponse("User Already Active"));
	next();
}

module.exports = { isBlocked, isUnBlocked };
