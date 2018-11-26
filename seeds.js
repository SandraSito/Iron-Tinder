require('dotenv').config();

// Seeds file that remove all users and create 2 new users

// To execute this seed, run from the root of the project
// $ node bin/seeds.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const axios = require("axios");
const bcryptSalt = 11;

mongoose
  .connect('mongodb://localhost/iron-tinder', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

  // https://slack.com/api/channels.info?token=xoxp-2432150752-360856482067-487678719299-b06b55a4222871e6b246a9bcacb2dcee&channel=CEB4Y1SHE&pretty=1
  

  axios.get(`https://slack.com/api/channels.info?token=${process.env.TOKEN}&channel=${process.env.GROUP}&pretty=1`)
 .then((response) => {
  console.log(response.data.channel.members)
   response.data.channel.members.forEach(element => {
    axios.get(`https://slack.com/api/users.info?token=${process.env.TOKEN}&user=${element}&pretty=1`)
    .then((singleuser)=> {
      
      const newUser = new User();
      newUser.id = singleuser.data.user.id;
      newUser.team_id = singleuser.data.user.team_id;
      newUser.email = singleuser.data.user.profile.email;
      newUser.first_name = singleuser.data.user.profile.first_name;
      newUser.last_name = singleuser.data.user.profile.last_name;
      newUser.display_name = singleuser.data.user.profile.display_name;
      newUser.avatar_hash = singleuser.data.user.profile.avatar_hash;
      newUser.save()
      .then(() => {
        console.log("User created")
      })
      .catch(error => {
        console.log("Error to add a new user" + error);
        
      });
    })
   });
 });



