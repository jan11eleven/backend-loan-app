require("dotenv").config();
const express = require("express");
const PORT = 5000;

const app = express();

const session = require("express-session");
const passport = require("passport");
const googleAuthRoute = require("./routes/googleAuth");
const sessionSecret = process.env["SESSION_SECRET"];
const cors = require("cors");

app.use(
	cors({
		origin: "http://localhost:3000", // Replace with your frontend's URL
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
