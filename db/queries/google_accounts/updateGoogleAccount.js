const pool = require("../../db");
const dbSchemaName = process.env["DATABASE_SCHEMA_NAME"];

async function updateGoogleAccount(client, userId, googleAccountId) {
	try {
		const queryText = `
                UPDATE ${dbSchemaName}.google_accounts 
                SET user_id = $1, updated_on = now()
                WHERE id = $2
            `;

		const queryParams = [userId, googleAccountId];

		const result = client
			? await client.query(queryText, queryParams)
			: await pool.query(queryText, queryParams);

		return result;
	} catch (error) {
		console.error("createGoogleAccount Error!", error);
		throw error;
	}
}

module.exports = updateGoogleAccount;
