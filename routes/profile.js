const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const LikeDis = require("../models/Likes_dislikes.js");
const Match = require("../models/Matched.js");
const axios = require("axios");
const mongoose = require("mongoose");
const { ensureLoggedIn, ensureLoggedOut } = require("connect-ensure-login");



router.get('/myProfile',ensureLoggedIn("/"),(req, res) => {
  var frontInfo = {}
  User.findOne({slack_id:req.user.id})
  .then((user)=>{
    
    Promise.all([
      setLikes(user),
      setMatches(user),
      allUsers])
    .then(data => {
      console.log(data)
      console.log("________________")
      frontInfo = {user, userLikes:data[0], userMatches:data[1],list:data[2]}
      console.log(frontInfo)
      // return {user,userLikes,userMatches}
      res.render('profile/myProfile',{frontInfo})
    })
  })
});

router.get('/tryit',ensureLoggedIn("/"),(req, res) => {
axios.get("https://slack.com/api/channels.info?token=xoxp-2432150752-360856482067-487678719299-b06b55a4222871e6b246a9bcacb2dcee&channel=CEB4Y1SHE&pretty=1")
 .then((response) => {
  
   console.log(response.data.channel);
 });
});

function setMatches(loggedUser){
  return Match.findOne({slack_id:loggedUser.slack_id})
    .then((matches)=>{
      if(matches === null){
        const newMatch = new Match()
        newMatch.slack_id = loggedUser.slack_id;
        newMatch.matches = [];
        return newMatch.save()
        .then(()=>{
          console.log("Match table created")
          return newMatch;
        })
        .catch(()=>{
          console.log("Match table creation went wrong")
        })
      }else{
        console.log("User's matches already exists")
        return matches;
      }
    })
    .catch(()=>{
      console.log("Something was wrong during matches search")
    })
}

function setLikes(loggedUser){
  return new Promise((res, rej) => {
  res(LikeDis.findOne({slack_id:loggedUser.slack_id})
    .then((likes)=>{
      if(likes === null){
            const newLikedis = new LikeDis();
            newLikedis.slack_id = loggedUser.slack_id;
            newLikedis.likes = [];
            newLikedis.dislikes = [loggedUser.slack_id];
            return newLikedis.save()
          .then((newLikedis)=>{
            console.log("Like and Dislike table created")
            return newLikedis;
          }).catch((err)=>{
            console.log(err)
            console.log("Like and Dislike table creation went wrong")
          })
      } else {
        console.log("User's likes already exists")
        return likes;
      }
    }))
    .catch(()=>{
      rej('algo falla')
      console.log("Something went wrong on user search")
    })
  }
  )}

const allUsers = new Promise((res,rej) => {
  res(axios.get(`https://slack.com/api/channels.info?token=${process.env.TOKEN}&channel=${process.env.GROUP}&pretty=1`)
  .then(response => {
    
    return response.data.channel.members;
  }).catch(()=>{
    console.log("Something went wrong creating users list")
    rej('somethings went wrong in axios petition to dislikes')
  }),
  )})


module.exports = router;