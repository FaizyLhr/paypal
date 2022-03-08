require("dotenv").config();
const mongoose = require("mongoose");

let con = mongoose
	.connect("mongodb://localhost:27017/studyMeter", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	})
	.catch((err) => {
		console.log(err);
		process.exit(1);
	})
	.then(() => {
		console.log("connected to db in development environment");
		init();
	});

const defaultUser = require("./seeder/default");

async function init() {
	console.log("dropping DB");
	await mongoose.connection.db.dropDatabase();

	await defaultUser();

	exit();
}

function exit() {
	console.log("exiting");
	process.exit(1);
}
