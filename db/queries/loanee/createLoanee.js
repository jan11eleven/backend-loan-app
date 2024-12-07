const pool = require("../../db");
const dbSchemaName = process.env["DATABASE_SCHEMA_NAME"];

async function createLoanee(loanee) {
	const client = await pool.connect();
	try {
		await client.query("BEGIN");

		const {
			userId,
			firstName,
			middleName,
			lastName,
			dateOfBirth,
			emailAddress,
			phoneNumber,
			address,
			employerName,
			annualIncome,
			employmentStatus,
			bankAccountNumber,
			idType,
			idNumber,
			issueDate,
			expiryDate,
		} = loanee;

		const loaneeQueryText = `
            INSERT INTO ${dbSchemaName}.loanee(
	        user_id, first_name, middle_name, last_name, date_of_birth, email_address, phone_number, address)
	        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;

		const loaneeQueryParams = [
			userId,
			firstName,
			middleName,
			lastName,
			dateOfBirth,
			emailAddress,
			phoneNumber,
			address,
		];

		const loaneeResult = await client.query(loaneeQueryText, loaneeQueryParams);

		const loaneeId = loaneeResult.rows[0].id;

		// Create Loanee financial
		const loaneeFinancialQueryText = `
			INSERT INTO ${dbSchemaName}.loanee_financial(
			loanee_id, employer_name, annual_income, employment_status, bank_account_number)
			VALUES ($1, $2, $3, $4, $5)
			RETURNING *;
		`;

		const loaneeFinancialQueryParams = [
			loaneeId,
			employerName,
			annualIncome,
			employmentStatus,
			bankAccountNumber,
		];

		const loaneeFinancialResult = await client.query(
			loaneeFinancialQueryText,
			loaneeFinancialQueryParams
		);

		// Create Loanee Identification
		const loaneeIdentificationQueryText = `
			INSERT INTO ${dbSchemaName}.loanee_identification(
			loanee_id, id_type, id_number, issue_date, expiry_date)
			VALUES ($1, $2, $3, $4, $5)
			RETURNING *;
		`;

		const loaneeIdentificationQueryParams = [
			loaneeId,
			idType,
			idNumber,
			issueDate,
			expiryDate,
		];

		const loaneeIdentificationResult = await client.query(
			loaneeIdentificationQueryText,
			loaneeIdentificationQueryParams
		);

		await client.query("COMMIT");

		return loaneeResult;
	} catch (error) {
		await client.query("ROLLBACK");

		console.error("createUserAndGoogleAccount Insert Query Error!");
		throw error;
	} finally {
		client.release();
	}
}

module.exports = createLoanee;
