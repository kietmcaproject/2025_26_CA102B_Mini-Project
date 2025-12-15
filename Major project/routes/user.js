const express = require("express");
const router = express.Router();
const passport = require("passport");
const users = require("../controllers/users");

// Signup form
router.get("/signup", users.renderSignupForm);
// Create user
router.post("/signup", users.signup);

// Login form
router.get("/login", users.renderLoginForm);
// Login action
router.post(
    "/login",
    passport.authenticate("local", {
        failureFlash: true,
        failureRedirect: "/login",
    }),
    users.login
);

// Logout
router.get("/logout", users.logout);

module.exports = router;
