const pool = require("../../db");
const createGoogleAccount = require("../google_accounts/createGoogleAccount");
const getGoogleAccountByGoogleId = require("../google_accounts/getGoogleAccountByGoogleId");
const createUser = require("../users/createUser");
const getUserByGoogleAccId = require("../users/getUserByGoogleAccId");
const updateGoogleAccount = require("../google_accounts/updateGoogleAccount");

async function createUserAndGoogleAccount(profile) {
	const client = await pool.connect();
	try {
		await client.query("BEGIN");

		await createGoogleAccount(client, profile);

		const getGoogleAccountData = await getGoogleAccountByGoogleId(
			client,
			profile.id
		);

		await createUser(client, getGoogleAccountData.rows[0]);

		const googleAccountId = getGoogleAccountData.rows[0].id;

		const getUserData = await getUserByGoogleAccId(client, googleAccountId);

		const userId = getUserData.rows[0].id;

		await updateGoogleAccount(client, userId, googleAccountId);

		await client.query("COMMIT");

		return getUserData;
	} catch (error) {
		await client.query("ROLLBACK");

		console.error("createUserAndGoogleAccount Error!");
		throw error;
	} finally {
		client.release();
	}
}

module.exports = createUserAndGoogleAccount;
