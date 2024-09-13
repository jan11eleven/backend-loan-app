function loanProductsBodyValidation(loanProduct) {
	const { userId, productName, loanAmount, term, interestRate } = loanProduct;

	if (
		userId == null ||
		productName == null ||
		loanAmount == null ||
		term == null ||
		interestRate == null
	) {
		return false;
	}

	if (
		typeof userId !== "number" ||
		typeof productName !== "string" ||
		typeof loanAmount !== "number" ||
		typeof term !== "number" ||
		typeof interestRate !== "number"
	) {
		return false;
	}

	return true;
}

module.exports = loanProductsBodyValidation;
