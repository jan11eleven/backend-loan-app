const express = require("express");
const route = express.Router();
const passport = require("passport");
const pool = require("../db/db");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const dbSchemaName = process.env["DATABASE_SCHEMA_NAME"];

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
			const result = await pool.query(
				`SELECT * FROM ${dbSchemaName}.google_accounts WHERE google_id = $1`,
				[profile.id]
			);

			if (result.rowCount !== 0) {
				userData = result.rows[0];
			}

			if (result.rowCount === 0) {
				// if not found, create user
				await pool.query(
					`
                        INSERT INTO ${dbSchemaName}.google_accounts (
                            google_id, display_name, given_name, family_name, email, photo, provider, updated_on
                        ) VALUES ($1, $2, $3, $4, $5, $6, $7, now())
                    `,
					[
						profile.id,
						profile.displayName,
						profile.name.givenName,
						profile.name.familyName,
						profile.emails[0].value,
						profile.photos[0].value,
						profile.provider,
					]
				);

				const result = await pool.query(
					`SELECT * FROM ${dbSchemaName}.google_accounts WHERE google_id = $1`,
					[profile.id]
				);

				if (result.rowCount !== 0) {
					userData = result.rows[0];
				}

				return done(null, userData);
			} else {
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
	// middleware for user add or create
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
