const pool = require("../../db");
const dbSchemaName = process.env["DATABASE_SCHEMA_NAME"];
const dbPagination = require("../../dbPagination");

async function getAllLoansDbByUserId(client, page = 1, perPage = 10, userId) {
	try {
		const offset = (page - 1) * perPage;
		const limit = perPage;

		const pagination = dbPagination(limit, offset);

		const queryText = `SELECT loan.id, loan.user_id, loan.loanee_id, loan.loan_amount, loan.interest_rate, loan.term, loan.loan_status, loan.start_date, loan.end_date, loan.created_on, loan.updated_on, loan.loan_reference_id, CONCAT(loanee.first_name, ' ', loanee.last_name) AS loanee_full_name FROM ${dbSchemaName}.loan AS loan LEFT JOIN ${dbSchemaName}.loanee AS loanee ON loan.loanee_id = loanee.id WHERE loan.user_id = ${userId} ORDER BY loan.created_on DESC ${pagination} `;

		const queryTotalRowsText = `SELECT COUNT(*) AS total_rows FROM ${dbSchemaName}.loan WHERE loan.user_id = ${userId}`;

		const paginatedResult = client
			? await client.query(queryText)
			: await pool.query(queryText);

		const totalRowsResult = client
			? await client.query(queryTotalRowsText)
			: await pool.query(queryTotalRowsText);

		return {
			loanData: paginatedResult.rows,
			totalRows:
				totalRowsResult.rows.length > 0
					? totalRowsResult.rows[0].total_rows
					: 0,
		};
	} catch (error) {
		console.error("getAllLoans Error", error);
		throw error;
	}
}

module.exports = getAllLoansDbByUserId;
