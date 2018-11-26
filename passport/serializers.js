const passport = require('passport');
const User = require('../models/User');

passport.serializeUser(function(user, done) {
  done(null, user);
 });
 
 passport.deserializeUser(function(obj, done) {
  done(null, obj);
 });