const express = require("express");
const route = express.Router();
const createLoanee = require("../db/queries/loanee/createLoanee");
const getLoaneeByUserId = require("../db/queries/loanee/getLoaneeByUserId");
const loaneeBodyValidation = require("../validations/loanee/loaneeBodyValidation");

route.post("/loanee", async (req, res) => {
	try {
		const loaneeBody = req.body;

		const validationResult = loaneeBodyValidation(loaneeBody);

		console.log(validationResult);

		if (!validationResult.success) {
			return res
				.json({
					status: 400,
					error: "Bad Request",
					message: "Invalid loan product data. Please check the input fields.",
					validationError: validationResult.error,
				})
				.status(400);
		}

		const result = await createLoanee(loaneeBody);

		return res
			.json({
				method: "POST",
				status: 201,
				message: "A Loanee successfully created.",
			})
			.status(201);
	} catch (error) {
		console.error("/loanee Route", error);
		return res.json({
			method: "POST",
			status: 500,
			error,
			message: `Server error!`,
		});
	}
});

route.get("/loanee/:userId", async (req, res) => {
	try {
		const userId = req.params.userId;
		const { fields } = req.query;

		const result = await getLoaneeByUserId(null, userId, fields);

		if (result.rowCount === 0) {
			return res.json({
				method: "GET",
				loaneeData: null,
				status: 200,
				error: "Not found",
				message: `The Loanee/s with a user ID ${userId} does not exist`,
			});
		}

		return res.json({
			method: "GET",
			status: 200,
			message: `Loanee data fetched successfully.`,
			loaneeData: result.rows,
		});
	} catch (error) {
		console.error("/loanee/:userId Route Error", error);
		res.json({
			method: "GET",
			userData: null,
			status: 500,
			error,
			message: `Server error!`,
		});

		throw error;
	}
});

module.exports = route;
