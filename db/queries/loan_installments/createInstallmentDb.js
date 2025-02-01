const pool = require("../../db");
const dbSchemaName = process.env["DATABASE_SCHEMA_NAME"];

async function createInstallmentDb(client, installments) {
	try {
		// Construct query placeholders for multiple rows

		const values = [];
		const placeholders = installments
			.map((_, index) => {
				const baseIndex = index * 12; // 12 placeholders per row
				return `(
                $${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, 
                $${baseIndex + 4}, $${baseIndex + 5}, $${baseIndex + 6}, 
                $${baseIndex + 7}, $${baseIndex + 8}, $${baseIndex + 9}, 
                $${baseIndex + 10}, $${baseIndex + 11}, $${baseIndex + 12}, 
                now(), now()
            )`;
			})
			.join(", ");

		// Flatten the installments array into the `values` array
		installments.forEach((installment) => {
			values.push(
				installment.get("loanId"),
				installment.get("loaneeId"),
				installment.get("userId"),
				installment.get("loanReferenceId"),
				installment.get("installmentNumber"),
				installment.get("principalAmount"),
				installment.get("interestAmount"),
				installment.get("totalAmount"),
				installment.get("installmentStatus"),
				installment.get("amountPaid"),
				installment.get("dueDate"),
				installment.get("paymentDate")
			);
		});

		const queryText = `INSERT INTO ${dbSchemaName}.loan_installment(
            loan_id,
            loanee_id,
            user_id,
            loan_reference_id,
            installment_number,
            principal_amount,
            interest_amount,
            total_amount,
            installment_status,
            amount_paid,
            due_date,
            payment_date,
            created_on,
            updated_on
        ) VALUES ${placeholders}
        RETURNING *;`;

		const result = client
			? await client.query(queryText, values)
			: await pool.query(queryText, values);

		return result.rows;
	} catch (error) {
		console.error("createInstallmentDb Insert Query Error!", error);
		throw error;
	}
}

module.exports = createInstallmentDb;
