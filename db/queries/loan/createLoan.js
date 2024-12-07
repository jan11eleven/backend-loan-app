const pool = require("../../db");
const dbSchemaName = process.env["DATABASE_SCHEMA_NAME"];

async function createLoan(client, loan) {
	try {
		const queryText = `INSERT INTO ${dbSchemaName}.loan(
	        user_id, loanee_id, loan_amount, interest_rate, term, loan_status, start_date, end_date)
	        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;`;

		const queryParams = [
			loan.userId,
			loan.loaneeId,
			loan.loanAmount,
			loan.interestRate,
			loan.term,
			loan.loanStatus,
			loan.startDate,
			loan.endDate,
		];

		const result = client
			? await client.query(queryText, queryParams)
			: await pool.query(queryText, queryParams);

		return result;
	} catch (error) {
		console.error("createLoan Insert Query Error!", error);
		throw error;
	}
}

module.exports = createLoan;
