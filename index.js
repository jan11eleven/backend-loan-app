require("dotenv").config();
const express = require("express");
const PORT = 5000;

const app = express();

const session = require("express-session");
const passport = require("passport");
const sessionSecret = process.env["SESSION_SECRET"];
const cors = require("cors");

// file imports
const googleAuthRoute = require("./routes/googleAuthRoute");
const isAuthenticated = require("./utils/isAuthenticated");

// route imports
const usersRoute = require("./routes/usersRoute");
const loanProductsRoute = require("./routes/loanProductsRoute");

app.use(
	cors({
		origin: process.env["FRONTEND_URL"], // Replace with your frontend's URL
		credentials: true,
	})
);

app.use(
	session({
		name: "session",
		resave: false,
		saveUninitialized: false,
		secret: sessionSecret,
		cookie: { secure: false },
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.use(googleAuthRoute);

app.use(express.json());

app.use("/api/v1", loanProductsRoute);

app.use(isAuthenticated);

app.get("/dashboard", (req, res) => {
	const userData = req.session.passport?.user;
	res.json({
		isAuthenticated: true,
		message: "Successfully logged in.",
		redirectUrl: null,
		userData,
	});
});

app.use("/api/v1", usersRoute);

app.use(function (err, req, res, next) {
	if (err) {
		res.status(500).send("An error occurred.");
	} else {
		next();
	}
});

app.get("/", function (req, res) {
	res.send("Root API");
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
