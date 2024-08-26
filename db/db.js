const { Pool } = require("pg");

// Create a new Pool instance
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	max: 20, // set pool max size to 20
	idleTimeoutMillis: 1000, // close idle clients after 1 second
	connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
	maxUses: 7500,
});

// Function to query the database
const queryDatabase = async () => {
	try {
		const res = await pool.query("SELECT NOW()");
		if (res.rowCount) {
			console.log("Database Connection is up!");
		}
	} catch (err) {
		console.error("Error executing query", err.stack);
	}
};

// Run the query
queryDatabase();

module.exports = pool;
