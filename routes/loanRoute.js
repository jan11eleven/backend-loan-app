const express = require("express");
const route = express.Router();
const createLoan = require("../db/queries/loan/createLoan");
const loanBodyValidation = require("../validations/loan/loanBodyValidation");
const getAllLoans = require("../db/queries/loan/getAllLoans");

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

route.get("/loans", async (req, res) => {
	try {
		const loansGetResult = await getAllLoans();

		if (loansGetResult.rowCount === 0) {
			return res.json({
				method: "GET",
				loanData: null,
				status: 200,
				message: "Loan table is empty",
			});
		}

		return res.json({
			method: "GET",
			loanData: loansGetResult.rows,
			status: 200,
			message: `${loansGetResult.rowCount} Loans fetched successfully.`,
		});
	} catch (error) {}
});

module.exports = route;
