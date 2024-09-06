const pool = require("../../db");
const dbSchemaName = process.env["DATABASE_SCHEMA_NAME"];

async function getAllUsers(client) {
	try {
		const queryText = `SELECT * FROM ${dbSchemaName}.users`;

		const result = client
			? await client.query(queryText)
			: await pool.query(queryText);

		return result;
	} catch (error) {
		console.error("getAllUsers Error", error);
		throw error;
	}
}

module.exports = getAllUsers;
