const { z } = require("zod");
const { dateRegex } = require("../regex/regex");

function loanBodyValidation(loan) {
	const LoanValidationSchema = z.object({
		userId: z.number(),
		loaneeId: z.number(),
		loanAmount: z.number(),
		term: z.number(),
		interestRate: z.number(),
		loanStatus: z.string(),
		// startDate: z.string().regex(dateRegex),
		// endDate: z.string().regex(dateRegex),
	});

	const result = LoanValidationSchema.safeParse(loan);

	return result;
}

module.exports = loanBodyValidation;
