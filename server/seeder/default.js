const User = require("../models/User");
const School = require("../models/School");

const faker = require("faker");

async function seedUser() {
	// Seed Admin
	{
		let newUser = new User();
		newUser.role = 1;

		newUser.email = "admin@gmail.com";
		newUser.name = "admin";
		newUser.school = "alpha";
		newUser.schoolCode = "0000";
		newUser.status = 1;
		newUser.year = "year";

		newUser.setPassword("1234");
		newUser.isEmailVerified = true;

		await newUser.save();
	}
	// Seed user
	{
		let newUser = new User();
		newUser.status = 1;

		newUser.email = "user@gmail.com";
		newUser.name = "user";
		newUser.year = "year";
		newUser.school = "alpha";
		newUser.schoolCode = "0000";

		newUser.setPassword("1234");
		newUser.isEmailVerified = true;

		await newUser.save();
	}
	console.log("Default Users Seeded");

	// School Seeder
	for (let i = 1; i <= 5; i++) {
		let school = new School();
		school.email = faker.internet.email();
		school.name = `name${i}`;
		school.code = `code${i}`;
		school.address = `address${i}`;
		school.files = [{ name: `name${i}`, url: `uploads/dummy.jpg` }];
		school.phone = "123456789";
		school.status = 1;

		await school.save();
	}
	console.log("Schools Seeded");
}

module.exports = seedUser;
