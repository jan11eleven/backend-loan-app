const pool = require("../../db");
const dbSchemaName = process.env["DATABASE_SCHEMA_NAME"];

async function getLoanByLoanReferenceId(client, loanReferenceId, userId) {
	try {
		const queryText = `SELECT loan_status FROM ${dbSchemaName}.loan WHERE loan_reference_id = $1 AND user_id = $2`;

		const queryParams = [loanReferenceId, userId];

		const result = client
			? await client.query(queryText, queryParams)
			: await pool.query(queryText, queryParams);

		return result;
	} catch (error) {
		console.error("getLoanByLoanReferenceId Query Fetch Error!", error);
		throw error;
	}
}

module.exports = getLoanByLoanReferenceId;
