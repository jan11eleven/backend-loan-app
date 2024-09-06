const pool = require("../../db");
const dbSchemaName = process.env["DATABASE_SCHEMA_NAME"];

async function getUserById(client, id) {
	try {
		const queryText = `SELECT * FROM ${dbSchemaName}.users WHERE id = $1`;

		const queryParams = [id];

		const result = client
			? await client.query(queryText, queryParams)
			: await pool.query(queryText, queryParams);

		return result;
	} catch (error) {
		console.error("getUserById Error", error);
		throw error;
	}
}

module.exports = getUserById;
