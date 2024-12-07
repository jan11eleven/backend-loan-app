const pool = require("../../db");
const dbSchemaName = process.env["DATABASE_SCHEMA_NAME"];

async function getLoaneeByUserId(client, userId, fields) {
	try {
		let concatFields = "*";

		if (fields) {
			concatFields = fields;
		}

		const queryText = `SELECT ${concatFields} FROM ${dbSchemaName}.loanee WHERE user_id = $1`;

		const queryParams = [userId];

		const result = client
			? await client.query(queryText, queryParams)
			: await pool.query(queryText, queryParams);

		console.log(result);

		return result;
	} catch (error) {
		console.error("getLoaneeByUserId Query Fetch Error!", error);
		throw error;
	}
}

module.exports = getLoaneeByUserId;
