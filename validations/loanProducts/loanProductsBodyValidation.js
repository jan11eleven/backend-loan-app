function loanProductsBodyValidation(loanProduct) {
	const { userId, loanProductName, loanAmount, term, interestRate } =
		loanProduct;

	if (
		userId == null ||
		loanProductName == null ||
		loanAmount == null ||
		term == null ||
		interestRate == null
	) {
		return false;
	}

	if (
		typeof userId !== "number" ||
		typeof loanProductName !== "string" ||
		typeof loanAmount !== "number" ||
		typeof term !== "number" ||
		typeof interestRate !== "number"
	) {
		return false;
	}

	return true;
}

module.exports = loanProductsBodyValidation;
