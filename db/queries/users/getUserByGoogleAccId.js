const pool = require("../../db");
const dbSchemaName = process.env["DATABASE_SCHEMA_NAME"];

async function getUserByGoogleAccId(client, googleAccountId) {
	try {
		const queryText = `SELECT * FROM ${dbSchemaName}.users WHERE google_account_id = $1`;

		const queryParams = [googleAccountId];

		const result = client
			? await client.query(queryText, queryParams)
			: await pool.query(queryText, queryParams);

		return result;
	} catch (error) {
		console.error("getUserByGoogleAccId Error!", error);
		throw error;
	}
}

module.exports = getUserByGoogleAccId;
