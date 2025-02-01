const express = require("express");
const route = express.Router();
const createLoanAction = require("../actions/loan/createLoanAction");
const createLoanInstallmentAction = require("../actions/loan/createLoanInstallmentAction");
const loanBodyValidation = require("../validations/loan/loanBodyValidation");
const getAllLoansDbByUserId = require("../db/queries/loan/getAllLoansDbByUserId");
const getAllLoansByUidAndSearchDb = require("../db/queries/loan/getAllLoansByUidAndSearchDb");
const getLoanByLoanReferenceId = require("../db/queries/loan/getLoanByLoanReferenceId");
const rejectLoanStatusDb = require("../db/queries/loan/rejectLoanStatusDb");

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
		return res.status(500).json({
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
	} catch (error) {
		console.error("/loans", error);
		return res.status(500).json({
			method: "GET",
			status: 500,
			error,
			message: `Server error!`,
		});
	}
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
	} catch (error) {
		console.error("/loans/search", error);
		return res.status(500).json({
			method: "GET",
			status: 500,
			error,
			message: `Server error!`,
		});
	}
});

route.post("/loan/approve/:loanReferenceId", async (req, res) => {
	try {
		const loanReferenceId = req.params.loanReferenceId;
		const loanDetails = req.body;

		const getLoanByLoanReferenceIdResult = await getLoanByLoanReferenceId(
			null,
			loanReferenceId,
			loanDetails.user_id
		);

		console.log(loanReferenceId);
		console.log(getLoanByLoanReferenceIdResult);

		if (getLoanByLoanReferenceIdResult.rowCount === 0) {
			return res.status(404).json({
				method: "POST",
				loanReferenceId: loanReferenceId,
				status: 404,
				message: `The specified loan does not exist.`,
			});
		}

		const loanStatus = getLoanByLoanReferenceIdResult.rows[0].loan_status;

		if (!loanStatus === "PENDING") {
			return res.json({
				method: "POST",
				loanReferenceId: loanReferenceId,
				status: 200,
				message: `This loan cannot be rejected. Its current status is '${loanStatus}'.`,
			});
		}

		await createLoanInstallmentAction(loanDetails, loanReferenceId);

		return res.status(201).json({
			method: "POST",
			loanDetails: loanDetails,
			loanReferenceId: loanReferenceId,
			status: 201,
			message: `Loan Installment created successfully.`,
			action: "APPROVED",
		});
	} catch (error) {
		console.error("/loan/approve/:loanReferenceId Route Error", error);
		return res.status(500).json({
			method: "POST",
			status: 500,
			error,
			message: `Server error!`,
		});
	}
});

route.post("/loan/reject/:loanReferenceId", async (req, res) => {
	try {
		const loanReferenceId = req.params.loanReferenceId;
		const loanDetails = req.body;

		const getLoanByLoanReferenceIdResult = await getLoanByLoanReferenceId(
			null,
			loanReferenceId,
			loanDetails.user_id
		);

		if (getLoanByLoanReferenceIdResult.rowCount === 0) {
			return res.status(404).json({
				method: "POST",
				loanReferenceId: loanReferenceId,
				status: 404,
				message: `The specified loan does not exist.`,
			});
		}

		const loanStatus = getLoanByLoanReferenceIdResult.rows[0].loan_status;

		if (!loanStatus === "PENDING") {
			return res.json({
				method: "POST",
				loanReferenceId: loanReferenceId,
				status: 200,
				message: `This loan cannot be rejected. Its current status is '${loanStatus}'.`,
			});
		}

		await rejectLoanStatusDb(null, loanReferenceId);

		return res.status(200).json({
			method: "POST",
			loanDetails: loanDetails,
			loanReferenceId: loanReferenceId,
			status: 200,
			message: `This Loan has been rejected.`,
			action: "REJECTED",
		});
	} catch (error) {
		console.error("/loan/reject/:loanReferenceId Route Error", error);
		return res.status(500).json({
			method: "POST",
			status: 500,
			error,
			message: `Server error!`,
		});
	}
});

module.exports = route;
