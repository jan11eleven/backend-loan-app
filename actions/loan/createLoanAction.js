const createLoanDb = require("../../db/queries/loan/createLoanDb");
const { v4: uuidv4 } = require("uuid");
const generateRandomString = require("../../utils/generateRandomString");

async function createLoanAction(loanData) {
	try {
		const generatedRandomString = generateRandomString(12);

		loanData = {
			...loanData,
			loanReferenceId: "LN-" + generatedRandomString,
		};

		const createLoanDbResult = await createLoanDb(null, loanData);

		return createLoanDbResult;
	} catch (error) {}
}

module.exports = createLoanAction;
