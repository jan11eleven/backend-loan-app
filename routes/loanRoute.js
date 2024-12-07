const express = require("express");
const route = express.Router();
const createLoan = require("../db/queries/loan/createLoan");
const loanBodyValidation = require("../validations/loan/loanBodyValidation");

route.post("/loan", async (req, res) => {
	try {
		const loanBody = req.body;

		const validationResult = loanBodyValidation(loanBody);

		if (!validationResult.success) {
			return res
				.json({
					status: 400,
					error: "Bad Request",
					message: "Invalid loan. Please check the input fields.",
					validationError: validationResult.error,
				})
				.status(400);
		}

		const createLoanResult = await createLoan(null, loanBody);

		return res
			.json({
				method: "POST",
				status: 201,
				message: "A Loan successfully created.",
			})
			.status(201);
	} catch (error) {
		console.error("/loan Route Error", error);
		return res.json({
			method: "POST",
			status: 500,
			error,
			message: `Server error!`,
		});
	}
});

module.exports = route;
