const express = require("express");
const route = express.Router();
const getAllUsers = require("../db/queries/users/getAllUsers");
const getUserById = require("../db/queries/users/getUserById");

route.get("/users", async (req, res) => {
	try {
		const result = await getAllUsers(null);

		if (result.rowCount === 0) {
			return res.json({
				method: "GET",
				userData: null,
				status: 200,
				message: "User table is empty",
			});
		}

		return res.json({
			method: "GET",
			userData: result.rows,
			status: 200,
			message: `${result.rowCount} users fetched successfully.`,
		});
	} catch (error) {
		console.error("/users Route Error", error);
		res.json({
			method: "GET",
			userData: null,
			status: 500,
			message: `Server error!`,
		});

		throw error;
	}
});

route.get("/users/:id", async (req, res) => {
	try {
		const userId = req.params.id;

		const result = await getUserById(null, userId);

		if (result.rowCount === 0) {
			return res.json({
				method: "GET",
				userData: null,
				status: 200,
				message: `The user with ID ${userId} does not exist`,
			});
		}

		return res.json({
			method: "GET",
			userData: result.rows[0],
			status: 200,
			message: `User data fetched successfully.`,
		});
	} catch (error) {
		console.error("/users Route Error", error);
		res.json({
			method: "GET",
			userData: null,
			status: 500,
			message: `Server error!`,
		});

		throw error;
	}
});

module.exports = route;
