const pool = require("../../db");
const dbSchemaName = process.env["DATABASE_SCHEMA_NAME"];

async function updateLoanStatusDb(client, loanReferenceId, loanStatus) {
	try {
		const queryText = `UPDATE ${dbSchemaName}.loan SET loan_status = $1 WHERE loan_reference_id = $2 
        RETURNING *;`;

		const queryParams = [loanStatus, loanReferenceId];

		const result = client
			? await client.query(queryText, queryParams)
			: await pool.query(queryText, queryParams);

		return result;
	} catch (error) {
		console.error("updateLoanStatus Query Error!", error);
		throw error;
	}
}

module.exports = updateLoanStatusDb;
