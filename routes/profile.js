const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const axios = require("axios")
const { ensureLoggedIn, ensureLoggedOut } = require("connect-ensure-login");



router.get('/logindex',ensureLoggedIn("/"),(req, res) => {
  
  res.render('profile/logindex')
});

router.get('/tryit',ensureLoggedIn("/"),(req, res) => {
axios.get("https://slack.com/api/channels.info?token=xoxp-2432150752-360856482067-487678719299-b06b55a4222871e6b246a9bcacb2dcee&channel=CEB4Y1SHE&pretty=1")
 .then((response) => {
  
   console.log(response.data.channel);
 });
});

module.exports = router;