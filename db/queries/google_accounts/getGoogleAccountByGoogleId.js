const pool = require("../../db");
const dbSchemaName = process.env["DATABASE_SCHEMA_NAME"];

async function getGoogleAccountByGoogleId(client, googleId) {
	try {
		const queryText = `SELECT * FROM ${dbSchemaName}.google_accounts WHERE google_id = $1`;

		const queryParams = [googleId];

		const result = client
			? await client.query(queryText, queryParams)
			: await pool.query(queryText, queryParams);

		return result;
	} catch (error) {
		console.error("getGoogleAccountByGoogleId Error!", error);
		throw error;
	}
}

module.exports = getGoogleAccountByGoogleId;
