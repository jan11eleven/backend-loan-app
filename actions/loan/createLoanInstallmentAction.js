const convertInterestRateToPercent = require("../../utils/convertInterestRateToPercent");
const convertAmountToDecimals = require("../../utils/convertAmountToDecimals");
const createInstallmentAndApproveLoanStatusDb = require("../../db/queries/transactions/createInstallmentAndApproveLoanStatusDb");

function createLoanInstallmentAction(loanDetails, loanReferenceId) {
	// Calculate principal and interest
	const principalAmount = convertAmountToDecimals(
		Number(loanDetails.loan_amount) / loanDetails.term
	);
	const interestAmount = convertAmountToDecimals(
		Number(loanDetails.loan_amount) *
			convertInterestRateToPercent(loanDetails.interest_rate)
	);

	// let approvedDate = new Date(loanDetails.updated_on);

	// Initialize array and populate in a single loop
	const installmentDetailsArray = [];

	let loanStartDate;
	let loanEndDate;

	for (let i = 0; i < loanDetails.term; i++) {
		const installmentMap = new Map();
		let installmentDate = new Date();

		installmentMap.set("loanId", loanDetails.id);
		installmentMap.set("loaneeId", loanDetails.loanee_id);
		installmentMap.set("userId", loanDetails.user_id);
		installmentMap.set("loanReferenceId", loanReferenceId);
		installmentMap.set("installmentNumber", i + 1);
		installmentMap.set("principalAmount", principalAmount);
		installmentMap.set("interestAmount", interestAmount);
		installmentMap.set("totalAmount", principalAmount + interestAmount);
		installmentMap.set("installmentStatus", "PENDING");
		installmentMap.set("amountPaid", 0);

		installmentDate.setMonth(installmentDate.getMonth() + i + 1);
		installmentMap.set("dueDate", installmentDate.toISOString());
		installmentMap.set("paymentDate", null);
		installmentDetailsArray.push(installmentMap);
	}

	let endDate = new Date();
	endDate.setMonth(endDate.getMonth() + loanDetails.term);

	const result = createInstallmentAndApproveLoanStatusDb(
		installmentDetailsArray,
		loanReferenceId,
		endDate
	);

	return installmentDetailsArray;
}

module.exports = createLoanInstallmentAction;
