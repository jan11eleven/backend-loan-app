const pool = require("../../db");
const dbSchemaName = process.env["DATABASE_SCHEMA_NAME"];

async function createUser(client, googleAccountDetails) {
	try {
		const queryText = `
                INSERT INTO ${dbSchemaName}.users (
                    google_account_id, first_name, last_name, email, updated_on
                ) VALUES ($1, $2, $3, $4, now())
            `;

		console.log("-------------------");
		console.log(googleAccountDetails);

		const queryParams = [
			googleAccountDetails.id,
			googleAccountDetails.given_name,
			googleAccountDetails.family_name,
			googleAccountDetails.email,
		];

		const result = client
			? await client.query(queryText, queryParams)
			: await pool.query(queryText, queryParams);

		return result;
	} catch (error) {
		console.error("createUser Error!", error);
		throw error;
	}
}

module.exports = createUser;
