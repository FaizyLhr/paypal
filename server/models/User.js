let mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");
let crypto = require("crypto");
let jwt = require("jsonwebtoken");
let secret = require("../config").secret;
const mongoosePaginate = require("mongoose-paginate-v2");
var otpGenerator = require("otp-generator");

let UserSchema = new mongoose.Schema(
	{
		email: { type: String, required: true, lowercase: true, unique: true },
		name: { type: String, required: true },
		year: { type: String, required: true, default: null },

		status: { type: Number, default: 3 }, // 1-active 2-blocked 3-pending

		school: { type: String },
		schoolCode: { type: String },

		isEmailVerified: { type: Boolean, default: false },
		otp: { type: String, default: null },
		otpExpires: { type: Date, default: null },
		isOtpVerified: { type: Boolean, default: false },
		resetPasswordToken: { type: String, default: null },

		role: {
			type: Number, // 1-admin 2-user
			default: 2,
		},

		hash: String,
		salt: String,
	},
	{ timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: "is already taken." });
UserSchema.plugin(mongoosePaginate);

UserSchema.methods.generatePasswordRestToken = function () {
	this.resetPasswordToken = crypto.randomBytes(20).toString("hex");
};

UserSchema.methods.validPassword = function (password) {
	let hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, "sha512").toString("hex");
	return this.hash === hash;
};

UserSchema.methods.setPassword = function (password) {
	this.salt = crypto.randomBytes(16).toString("hex");
	this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, "sha512").toString("hex");
};

UserSchema.methods.setOTP = function () {
	this.otp = otpGenerator.generate(4, {
		lowerCaseAlphabets: false,
		upperCaseAlphabets: false,
		specialChars: false,
	});
	this.otpExpires = Date.now() + 3600000; // 1 hour
};

UserSchema.methods.generateJWT = function () {
	return jwt.sign(
		{
			id: this._id,
			email: this.email,
		},
		secret,
		{ expiresIn: "60d" }
	);
};

// var autoPopulate = function (next) {
// 	//TODO
// 	this.populate("school");

// 	next();
// };

// UserSchema.pre("findOne", autoPopulate);
// UserSchema.pre("find", autoPopulate);
// UserSchema.pre("findById", autoPopulate);

UserSchema.methods.toAuthJSON = function () {
	return {
		email: this.email,
		name: this.name,
		school: this.school,
		schoolCode: this.schoolCode,
		year: this.year,
		role: this.role,

		token: this.generateJWT(),
		status: this.status,
	};
};

UserSchema.methods.toJSON = function () {
	return {
		email: this.email,
		name: this.name,
		school: this.school,
		schoolCode: this.schoolCode,
		year: this.year,
		role: this.role,

		status: this.status,
	};
};

module.exports = mongoose.model("User", UserSchema);
