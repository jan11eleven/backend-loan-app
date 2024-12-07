// validates an amount between 0 and 100,000,000 with up to 2 decimal places:
const loanAmountRegex = /^(?:100000000(?:\.00?)?|(?:\d{1,8})(?:\.\d{1,2})?)$/;

// only accepts numbers between 1 and 60:
const termRegex = /^(?:[1-9]|[1-5][0-9]|60)$/;

// allows numbers between 0.01 and 999.99, but with 1 or 2 decimal places:
const interestRateRegex =
	/^(?:0?\.[0-9][1-9]?|[1-9][0-9]{0,2}(?:\.[0-9]{1,2})?)$/;

// allows number from 0 - 31
const postDateRegex = /^(0|[1-9]|[12][0-9]|3[01])$/;

// only accepts letters
const acceptLettersOnlyRegex = /^[A-Za-z\s]+$/;

// date regex format yyyy-mm-dd
const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

// email regex
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// pattern that matches a string with exactly 12 digits in the format "639#########"
const phoneNumberRegex = /^639\d{9}$/;

// Validates numbers with optional commas for thousands and up to two decimal places, disallowing leading zeros.
const amountRegex = /^(?!0\d)(\d{1,3}(,\d{3})*|\d+)(\.\d{2})?$/;

module.exports = {
	loanAmountRegex,
	termRegex,
	interestRateRegex,
	postDateRegex,
	acceptLettersOnlyRegex,
	dateRegex,
	emailRegex,
	phoneNumberRegex,
	amountRegex,
};
