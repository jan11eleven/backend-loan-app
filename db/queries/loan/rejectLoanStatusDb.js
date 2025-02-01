const pool = require("../../db");
const dbSchemaName = process.env["DATABASE_SCHEMA_NAME"];

async function rejectLoanStatusDb(client, loanReferenceId) {
	try {
		const queryText = `UPDATE ${dbSchemaName}.loan SET loan_status = $1, rejected_date = now() WHERE loan_reference_id = $2 
        RETURNING *;`;

		const queryParams = ["REJECTED", loanReferenceId];

		const result = client
			? await client.query(queryText, queryParams)
			: await pool.query(queryText, queryParams);

		return result;
	} catch (error) {
		console.error("rejectLoanStatusDb Query Error!", error);
		throw error;
	}
}

module.exports = rejectLoanStatusDb;
