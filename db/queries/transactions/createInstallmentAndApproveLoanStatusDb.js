const pool = require("../../db");
const approveLoanStatusDb = require("../loan/approveLoanStatusDb");
const createInstallmentDb = require("../loan_installments/createInstallmentDb");

async function createInstallmentAndApproveLoanStatusDb(
	installments,
	loanReferenceId,
	endDate
) {
	const client = await pool.connect();
	try {
		await client.query("BEGIN");

		const createInstallmentResult = await createInstallmentDb(
			client,
			installments
		);

		const approveLoanStatusDbResult = await approveLoanStatusDb(
			client,
			endDate,
			loanReferenceId
		);

		await client.query("COMMIT");

		return createInstallmentResult;
	} catch (error) {
		await client.query("ROLLBACK");

		console.error("createInstallmentAndApproveLoanStatus Error!");
		throw error;
	} finally {
		client.release();
	}
}

module.exports = createInstallmentAndApproveLoanStatusDb;
