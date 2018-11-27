require("dotenv").config();

// Seeds file that remove all users and create 2 new users

// To execute this seed, run from the root of the project
// $ node bin/seeds.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const axios = require("axios");
const bcryptSalt = 11;

mongoose
  .connect(
    "mongodb://localhost/iron-tinder",
    { useNewUrlParser: true }
  )
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
    User.collection.drop()
  .then(() => {

    axios
    .get(
      `https://slack.com/api/channels.info?token=${process.env.TOKEN}&channel=${
        process.env.GROUP
      }&pretty=1`
    )
    .then(response => {
      console.log(response.data.channel.members);
      response.data.channel.members.forEach(element => {
        axios
          .get(
            `https://slack.com/api/users.info?token=${
              process.env.TOKEN
            }&user=${element}&pretty=1`
          )
  
          .then(singleuser => {
            const userData = singleuser.data.user;
            const userProfile = singleuser.data.user.profile;
            const newUser = new User();
            newUser.id = userData.id;
            newUser.team_id = userData.team_id;
            newUser.email = userProfile.email;
            newUser.first_name = userProfile.first_name;
            newUser.last_name = userProfile.last_name;
            newUser.display_name = userProfile.display_name;
            newUser.avatar_img = `https://ca.slack-edge.com/${userData.team_id}-${
              userData.id
            }-${userProfile.avatar_hash}-1024`;
  
            newUser
              .save()
              .then(() => {
                console.log("User created");
              })
              .catch(error => {
                console.log("Error to add a new user" + error);
              });
          });
      });
    });
  


   })

  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });


  
