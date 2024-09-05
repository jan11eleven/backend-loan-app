const express = require("express");
const route = express.Router();
const passport = require("passport");
const pool = require("../db/db");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const getGoogleAccountByGoogleId = require("../db/queries/google_accounts/getGoogleAccountByGoogleId");
const createGoogleAccount = require("../db/queries/google_accounts/createGoogleAccount");
const createUserAndGoogleAccount = require("../db/queries/transactions/createUserAndGoogleAccount");

const googleClientId = process.env["GOOGLE_CLIENT_ID"];
const googleClientSecret = process.env["GOOGLE_CLIENT_SECRET"];

passport.use(
	new GoogleStrategy(
		{
			clientID: googleClientId,
			clientSecret: googleClientSecret,
			callbackURL: `http://localhost:5000/auth/google/redirect`,
		},

		async function (accessToken, refreshToken, profile, done) {
			// find user
			let userData;
			const result = await getGoogleAccountByGoogleId(null, profile.id);

			if (result.rowCount !== 0) {
				userData = result.rows[0];

				return done(null, userData);
			} else {
				// if not found, create user
				await createUserAndGoogleAccount(profile);

				const result = await getGoogleAccountByGoogleId(null, profile.id);

				if (result.rowCount !== 0) {
					userData = result.rows[0];
				}

				return done(null, userData);
			}
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser(async (user, done) => {
	done(null, user);
});

route.get("/logout", (req, res, next) => {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		res.redirect("/dashboard");
	});
});

route.get(
	"/auth/google",
	passport.authenticate("google", {
		scope: ["profile", "email"],
		prompt: "select_account",
	})
);

route.get(
	"/auth/google/redirect",
	passport.authenticate("google", {
		failureRedirect: "http://localhost:3000/",
	}),
	function (req, res) {
		res.redirect("http://localhost:3000/dashboard");
	}
);

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

route.get("/dashboard", isAuthenticated, (req, res) => {
	const userData = req.session.passport?.user;
	res.json({
		isAuthenticated: true,
		message: "Successfully logged in.",
		redirectUrl: null,
		userData,
	});
});
module.exports = route;
