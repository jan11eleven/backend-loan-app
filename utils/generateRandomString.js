const { v4: uuidv4 } = require("uuid");

function generateRandomString(length) {
	return uuidv4().replace(/-/g, "").toUpperCase().slice(0, length);
}

module.exports = generateRandomString;
