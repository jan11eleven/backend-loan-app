const express = require("express");
const route = express.Router();
const createLoanAction = require("../actions/loan/createLoanAction");
const loanBodyValidation = require("../validations/loan/loanBodyValidation");
const getAllLoansDbByUserId = require("../db/queries/loan/getAllLoansDbByUserId");
const getAllLoansByUidAndSearchDb = require("../db/queries/loan/getAllLoansByUidAndSearchDb");

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

		const createLoanActionResult = await createLoanAction(loanBody);

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
		// res.setHeader("Cache-Control", "no-store");
		const page = req.query.page;
		const perPage = req.query.perpage;
		const user_id = req.query.user_id;

		const loansGetResult = await getAllLoansDbByUserId(
			null,
			page,
			perPage,
			user_id
		);

		if (loansGetResult.totalRows == 0) {
			return res.json({
				method: "GET",
				loanData: null,
				status: 200,
				message: "Loan table is empty",
			});
		}

		return res.json({
			method: "GET",
			loanData: loansGetResult.loanData,
			status: 200,
			message: `${loansGetResult.totalRows} Loans fetched successfully.`,
			totalLoanDataRows: loansGetResult.totalRows,
		});
	} catch (error) {}
});

route.get("/loans/search", async (req, res) => {
	try {
		const page = req.query.page;
		const perPage = req.query.perpage;
		const user_id = req.query.user_id;
		const search_text = req.query.search_text;

		const loansGetResult = await getAllLoansByUidAndSearchDb(
			null,
			page,
			perPage,
			user_id,
			search_text
		);

		if (loansGetResult.totalRows == 0) {
			return res.json({
				method: "GET",
				loanData: null,
				status: 200,
				message:
					"No results found for your search. Please try using different keywords or check your input for accuracy.",
			});
		}

		return res.json({
			method: "GET",
			loanData: loansGetResult.loanData,
			status: 200,
			message: `${loansGetResult.totalRows} Loans fetched successfully.`,
			totalLoanDataRows: loansGetResult.totalRows,
		});
	} catch (error) {}
});

module.exports = route;
