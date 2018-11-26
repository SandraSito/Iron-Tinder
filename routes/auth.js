const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const axios = require("axios")
const { ensureLoggedIn, ensureLoggedOut } = require("connect-ensure-login");


router.get('/callback',
  passport.authenticate('slack', { failureRedirect: '/auth/login' }),
  (req, res) => {
    console.log(req.user)
    res.redirect('/profile/myProfile')
  }
);


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
