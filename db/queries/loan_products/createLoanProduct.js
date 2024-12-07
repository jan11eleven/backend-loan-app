const pool = require("../../db");
const dbSchema = process.env["DATABASE_SCHEMA_NAME"];

async function createLoanProduct(client, loanProduct) {
	try {
		const { userId, productName, loanAmount, term, interestRate, postDate } =
			loanProduct;

		const queryText = `INSERT INTO ${dbSchema}.loan_products (user_id, product_name, loan_amount, term, interest_rate, updated_on, post_date) VALUES ($1, $2, $3, $4, $5, now(), $6)`;

		const queryParams = [
			userId,
			productName,
			loanAmount,
			term,
			interestRate,
			postDate,
		];

		const result = client
			? await client.query(queryText, queryParams)
			: await pool.query(queryText, queryParams);

		console.log({ message: "A Loan Product successfully created.", result });
		return result;
	} catch (error) {
		console.error("createLoanProduct Insert Query Error: ", error);
		throw error;
	}
}

module.exports = createLoanProduct;
