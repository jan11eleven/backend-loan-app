const { z } = require("zod");
const {
	acceptLettersOnlyRegex,
	dateRegex,
	emailRegex,
	phoneNumberRegex,
} = require("../regex/regex");

function loaneeBodyValidation(loanee) {
	const LoaneeValidationSchema = z.object({
		userId: z.number(),
		firstName: z.string().regex(acceptLettersOnlyRegex).max(200).min(1),
		middleName: z.string().regex(acceptLettersOnlyRegex).max(200).min(1),
		lastName: z.string().regex(acceptLettersOnlyRegex).max(200).min(1),
		dateOfBirth: z.string().regex(dateRegex),
		emailAddress: z.string().regex(emailRegex).max(200).min(1),
		phoneNumber: z.string().regex(phoneNumberRegex),
		address: z.string().max(200).min(1),
		employerName: z.string().max(200).min(1),
		annualIncome: z.number().nonnegative(),
		employmentStatus: z.string().max(200).min(1),
		bankAccountNumber: z.string().max(200).min(1),
		idType: z.string().max(200).min(1),
		idNumber: z.string().max(200).min(1),
		issueDate: z.string().regex(dateRegex),
		expiryDate: z.string().regex(dateRegex),
	});

	const result = LoaneeValidationSchema.safeParse(loanee);

	return result;
}

module.exports = loaneeBodyValidation;
