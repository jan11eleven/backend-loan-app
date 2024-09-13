const express = require("express");
const route = express.Router();
const loanProductsBodyValidation = require("../validations/loanProducts/loanProductsBodyValidation");
const createLoanProduct = require("../db/queries/loan_products/createLoanProduct");

route.post("/loanproducts", async (req, res) => {
	try {
		const loanProductBody = req.body;

		const isValidLoanProduct = loanProductsBodyValidation(loanProductBody);

		if (!isValidLoanProduct) {
			res
				.json({
					error: "Bad Request",
					message: "Invalid loan product data. Please check the input fields.",
				})
				.status(400);
		}

		const result = await createLoanProduct(null, loanProductBody);

		res.json({
			method: "POST",
			status: 200,
			message: "A Loan Product successfully created.",
		});
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
