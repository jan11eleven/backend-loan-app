const pool = require("../../db");
const dbSchemaName = process.env["DATABASE_SCHEMA_NAME"];

async function getAllLoans(client) {
	try {
		const queryText = `SELECT * FROM ${dbSchemaName}.loan`;

		const result = client
			? await client.query(queryText)
			: await pool.query(queryText);

		return result;
	} catch (error) {
		console.error("getAllLoans Error", error);
		throw error;
	}
}

module.exports = getAllLoans;
