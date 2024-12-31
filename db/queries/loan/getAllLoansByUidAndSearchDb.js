const pool = require("../../db");
const dbSchemaName = process.env["DATABASE_SCHEMA_NAME"];
const dbPagination = require("../../dbPagination");

async function getAllLoansByUidAndSearchDb(
	client,
	page = 1,
	perPage = 10,
	userId,
	search
) {
	try {
		const offset = (page - 1) * perPage;
		const limit = perPage;

		const pagination = dbPagination(limit, offset);

		const queryText = `SELECT loan.id, loan.user_id, loan.loanee_id, loan.loan_amount, loan.interest_rate, loan.term, loan.loan_status, loan.start_date, loan.end_date, loan.created_on, loan.updated_on, loan.loan_reference_id, CONCAT(loanee.first_name, ' ', loanee.last_name) AS loanee_full_name FROM ${dbSchemaName}.loan AS loan LEFT JOIN ${dbSchemaName}.loanee AS loanee ON loan.loanee_id = loanee.id WHERE loan.user_id = $1 AND (loan.loan_reference_id ILIKE $2 OR loanee.full_name ILIKE $2) ORDER BY loan.created_on DESC ${pagination} `;

		const queryParams = [userId, `%${search}%`];

		const queryTotalRowsText = `SELECT COUNT(*) AS total_rows FROM ${dbSchemaName}.loan AS loan LEFT JOIN ${dbSchemaName}.loanee AS loanee ON loan.loanee_id = loanee.id WHERE loan.user_id = $1 AND (loan.loan_reference_id ILIKE $2 OR loanee.full_name ILIKE $2)`;

		const queryTotalRowsTextParams = [userId, `%${search}%`];

		const paginatedResult = client
			? await client.query(queryText, queryParams)
			: await pool.query(queryText, queryParams);

		const totalRowsResult = client
			? await client.query(queryTotalRowsText, queryTotalRowsTextParams)
			: await pool.query(queryTotalRowsText, queryTotalRowsTextParams);

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

module.exports = getAllLoansByUidAndSearchDb;
