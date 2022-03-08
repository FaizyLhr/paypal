let router = require("express").Router();

const passport = require("passport");

let { OkResponse, BadRequestResponse, UnauthorizedResponse } = require("express-http-response");

const { isBlocked, isUnBlocked } = require("../../middleWares/authentications");

const User = require("../../models/User");
const School = require("../../models/School");

const auth = require("../auth");

var emailService = require("../../utilities/emailService");
// console.log(emailService);

// get user for every time mail given
router.param("email", (req, res, next, email) => {
	User.findOne({ email }, (err, user) => {
		if (!err && user !== null) {
			// console.log(user);
			req.emailUser = user;
			return next();
		}
		return next(new BadRequestResponse("User not found!", 423));
	});
});

// General Check
router.get("/", function (req, res, next) {
	return next(
		new OkResponse({
			message: `Users Api's are working`,
		})
	);
});

// Signup
router.post("/signUp", async (req, res, next) => {
	if (!req.body.user || !req.body.user.email || !req.body.user.name || !req.body.user.year || !req.body.user.password) {
		return next(new BadRequestResponse("Missing Required parameters"));
	} else if (req.body.user.email.length === 0 || req.body.user.name.length === 0 || req.body.user.year.length === 0 || req.body.user.password.length === 0) {
		return next(new BadRequestResponse("Missing Required parameters"));
	}

	if (req.body.user.school) {
		if (!req.body.user.schoolCode) {
			return next(new BadRequestResponse("Missing Required parameters"));
		} else if (req.body.user.schoolCode.length === 0) {
			return next(new BadRequestResponse("Missing Required parameters"));
		}
	}
	if (req.body.user.schoolCode) {
		if (!req.body.user.school) {
			return next(new BadRequestResponse("Missing Required parameters"));
		} else if (req.body.user.school.length === 0) {
			return next(new BadRequestResponse("Missing Required parameters"));
		}
	}

	// Create user in our database
	let newUser = User();
	newUser.email = req.body.user.email;
	newUser.name = req.body.user.name;
	newUser.year = req.body.user.year;
	newUser.status = 1;

	if (req.body.user.school) {
		School.findOne({ code: req.body.user.schoolCode }, (err, school) => {
			if (err) return next(new BadRequestResponse(err));
			if (!school) {
				return next(new UnauthorizedResponse("Not Authorized Or School Code Not Matched"));
			}

			// console.log(school);
			newUser.school = school.name;
			newUser.schoolCode = school.code;

			newUser.setPassword(req.body.user.password);
			newUser.setOTP();

			// console.log(newUser);
			newUser.save((err, result) => {
				if (err) {
					return next(new BadRequestResponse(err));
				} else {
					emailService.sendEmailVerificationOTP(result);
					return next(new OkResponse(result));
				}
			});
		});
	} else {
		newUser.setPassword(req.body.user.password);
		newUser.setOTP();

		// console.log(newUser);
		newUser.save((err, result) => {
			if (err) {
				return next(new BadRequestResponse(err));
			} else {
				emailService.sendEmailVerificationOTP(result);
				return next(new OkResponse(result));
			}
		});
	}
});

// verifyOTP
router.post("/otp/verify/:email/:type", (req, res, next) => {
	if (!req.body.otp) {
		return next(new BadRequestResponse("Missing required parameter", 422));
	}

	let query = {
		email: req.emailUser.email,
		otp: req.body.otp,
		otpExpires: { $gt: Date.now() },
	};

	// console.log(query);
	User.findOne(query, function (err, user) {
		if (err || !user) {
			return next(new UnauthorizedResponse("Invalid OTP"));
		}
		user.otp = null;
		user.otpExpires = null;
		if (+req.params.type === 1) {
			user.isEmailVerified = true;
			console.log("user is verified");
		} else {
			user.generatePasswordRestToken();
		}

		user.save().then(function () {
			if (+req.params.type === 1) {
				return next(new OkResponse(user.toAuthJSON()));
			} else if (+req.params.type === 2) {
				return next(new OkResponse({ passwordRestToken: user.resetPasswordToken }));
			}
		});
	});
});

// Resend OTP
router.post("/otp/resend/:email", (req, res, next) => {
	req.emailUser.setOTP();
	req.emailUser.save((err, user) => {
		emailService.sendEmailVerificationOTP(req.emailUser);
		return next(
			new OkResponse({
				message: "OTP sent Successfully to registered email address",
			})
		);
	});
});

// Reset Password
router.post("/reset/password/:email", (req, res, next) => {
	// console.log(req.body);
	if (!req.body.resetPasswordToken || !req.body.password) {
		return next(new UnauthorizedResponse("Missing Required Parameters"));
	}
	if (req.body.resetPasswordToken !== req.emailUser.resetPasswordToken) {
		return next({ err: new UnauthorizedResponse("Invalid Password Reset Token") });
	}
	req.emailUser.setPassword(req.body.password);
	req.emailUser.resetPasswordToken = null;
	req.emailUser.save((err, user) => {
		if (err) return next(new BadRequestResponse(err));
		return next(new OkResponse(user.toAuthJSON()));
	});
});

// Login
router.post("/login", (req, res, next) => {
	// console.log(req.body);
	passport.authenticate("local", { session: false }, (err, user, info) => {
		if (err) return next(new BadRequestResponse(err));
		if (!user) {
			return next(new BadRequestResponse("No User Found"));
		}
		if (!user.isEmailVerified) {
			return next(new UnauthorizedResponse("Your email is not verified", 401));
		} else if (user.status === 2) {
			return next(new UnauthorizedResponse("Your Account is Blocked!, Contact to Support please", 403));
		}

		return next(new OkResponse(user.toAuthJSON()));
	})(req, res, next);
});

// User context Api
router.get("/context", auth.required, auth.user, (req, res, next) => {
	let user = req.user;
	return next(new OkResponse(user.toAuthJSON()));
});

// Block Specific User
router.put("/block/:email", auth.required, auth.admin, isBlocked, async (req, res, next) => {
	// console.log(req.user);
	req.emailUser.status = 2;
	req.emailUser.token = "";

	req.emailUser.save((err, result) => {
		if (err) return next(new BadRequestResponse(err));
		return next(new OkResponse(req.emailUser));
	});
});

// UnBlock Specific User
router.put("/unBlock/:email", auth.required, auth.admin, isUnBlocked, async (req, res, next) => {
	req.emailUser.status = 1;
	req.emailUser.save((err, result) => {
		if (err) return next(new BadRequestResponse(err));
		return next(new OkResponse(req.emailUser.toAuthJSON()));
	});
});

// View All users
router.get("/all", auth.required, auth.admin, (req, res, next) => {
	// console.log("Inside");
	const options = {
		page: +req.query.page || 1,
		limit: +req.query.limit || 20,
	};

	let query = {};
	query.role = 2;

	User.paginate(query, options, (err, result) => {
		if (err) return next(new BadRequestResponse(err), 500);
		return next(new OkResponse(result));
	});
});

// Get Students Count
router.get("/count", auth.required, auth.admin, (req, res, next) => {
	User.count({ role: 2 }, (err, count) => {
		if (err) next(new BadRequestResponse(err));
		return next(new OkResponse({ count }));
	});
});

// Get Active Students Count
router.get("/activeCount", auth.required, auth.admin, (req, res, next) => {
	User.count({ role: 2, status: 1 }, (err, count) => {
		if (err) next(new BadRequestResponse(err));
		return next(new OkResponse({ count }));
	});
});

// Get deActive Students Count
router.get("/deActiveCount", auth.required, auth.admin, (req, res, next) => {
	User.count({ role: 2, status: 2 }, (err, count) => {
		if (err) next(new BadRequestResponse(err));
		return next(new OkResponse({ count }));
	});
});

// View All customers
// router.get("/home/get/customer", isToken, isAdmin, (req, res, next) => {
// 	// console.log("Inside");
// 	const options = {
// 		page: +req.query.page || 1,
// 		limit: +req.query.limit || 20,
// 	};

// 	let query = {};
// 	query.role = 3;
// 	// User.find().then((result) => {
// 	// 	console.log(result)
// 	// 	next(new OkResponse({
// 	// 		result: result
// 	// 	}));
// 	// 	return;
// 	// }).catch((e) => {
// 	// 	return next(new BadRequestResponse(e));

// 	// })

// 	User.paginate(query, options, function (err, result) {
// 		if (err) {
// 			// console.log(err);
// 			return next(new BadRequestResponse("Server Error"), 500);
// 		}
// 		// console.log(result);
// 		// console.log(":::Result:::::", result);
// 		// console.log(":::Result Docs:::::", result.docs);
// 		return next(
// 			new OkResponse({
// 				result: result.docs,
// 			})
// 		);
// 	}).catch((e) => {
// 		// console.log(e);
// 		return next(new BadRequestResponse(e.error));
// 	});
// });

// View Specific User
router.get("/view/:email", auth.required, (req, res, next) => {
	User.findOne({
		email: req.emailUser.email,
	})
		.then((user) => {
			return next(new OkResponse(user));
		})
		.catch((err) => {
			return next(new BadRequestResponse(err));
		});
});

// Update Specific User
router.put("/edit/:email", auth.required, auth.user, (req, res, next) => {
	// console.log(req.body);
	req.emailUser.name = req.body.name || req.emailUser.name;
	req.emailUser.save((err, user) => {
		if (err) return next(new BadRequestResponse(err));
		return next(new OkResponse(user));
	});
});

module.exports = router;
