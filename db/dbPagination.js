function dbPagination(limit, offset) {
	return "LIMIT " + limit + " OFFSET " + offset;
}

module.exports = dbPagination;
