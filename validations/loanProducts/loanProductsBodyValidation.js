const { z } = require("zod");

function loanProductsBodyValidation(loanProduct) {
	const LoanProductValidationSchema = z.object({
		productName: z.string().max(62).min(8),
		loanAmount: z.number(),
		term: z.number(),
		interestRate: z.number(),
		loanStatus: z.string(),
	});

	const result = LoanProductValidationSchema.safeParse(loanProduct);

	return result;
}

module.exports = loanProductsBodyValidation;
