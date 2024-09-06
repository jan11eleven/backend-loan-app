// Protecting routes
const isAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) return next();
	res.json({
		isAuthenticated: false,
		message: "Please login.",
		redirectUrl: null,
		userData: null,
	});
};

module.exports = isAuthenticated;
