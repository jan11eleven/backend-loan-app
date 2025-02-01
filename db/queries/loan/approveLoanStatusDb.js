const pool = require("../../db");
const dbSchemaName = process.env["DATABASE_SCHEMA_NAME"];

async function approveLoanStatusDb(client, endDate, loanReferenceId) {
	try {
		const queryText = `UPDATE ${dbSchemaName}.loan SET loan_status = $1, approved_date = now(), start_date = now(), end_date = $2 WHERE loan_reference_id = $3
        RETURNING *;`;

		const queryParams = ["ACTIVE", endDate, loanReferenceId];

		const result = client
			? await client.query(queryText, queryParams)
			: await pool.query(queryText, queryParams);

		return result;
	} catch (error) {
		console.error("rejectLoanStatusDb Query Error!", error);
		throw error;
	}
}

module.exports = approveLoanStatusDb;
