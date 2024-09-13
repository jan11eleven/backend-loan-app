const express = require("express");
const route = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const getGoogleAccountByGoogleId = require("../db/queries/google_accounts/getGoogleAccountByGoogleId");
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

module.exports = route;
