const pool = require("../../db");
const dbSchemaName = process.env["DATABASE_SCHEMA_NAME"];

async function createGoogleAccount(client, profile) {
	try {
		const queryText = `
                INSERT INTO ${dbSchemaName}.google_accounts (
                    google_id, display_name, given_name, family_name, email, photo, provider, updated_on
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, now())
            `;

		const queryParams = [
			profile.id,
			profile.displayName,
			profile.name.givenName,
			profile.name.familyName,
			profile.emails[0].value,
			profile.photos[0].value,
			profile.provider,
		];

		const result = client
			? await client.query(queryText, queryParams)
			: await pool.query(queryText, queryParams);

		return result;
	} catch (error) {
		console.error("createGoogleAccount Error!", error);
		throw error;
	}
}

module.exports = createGoogleAccount;
