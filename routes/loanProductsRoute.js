const express = require("express");
const route = express.Router();
const loanProductsBodyValidation = require("../validations/loanProducts/loanProductsBodyValidation");
const createLoanProduct = require("../db/queries/loan_products/createLoanProduct");

route.post("/loanproducts", async (req, res) => {
	try {
		const loanProductBody = req.body;

		const validationResult = loanProductsBodyValidation(loanProductBody);

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

		const result = await createLoanProduct(null, loanProductBody);

		return res
			.json({
				method: "POST",
				status: 201,
				message: "A Loan Product successfully created.",
			})
			.status(201);
	} catch (error) {
		console.error("/loanproducts Route Error", error);
		res.json({
			method: "POST",
			status: 500,
			message: `Server error!`,
		});
	}
});

module.exports = route;
