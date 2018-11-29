require("dotenv").config();

// Seeds file that remove all users and create 2 new users

// To execute this seed, run from the root of the project
// $ node bin/seeds.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const LikeDis = require("./models/Likes_dislikes.js");
const Match = require("./models/Matched.js");
const axios = require("axios");

mongoose
  .connect(
    `${process.env.DBPATH}`,
    { useNewUrlParser: true }
  )
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
    updateDB();
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

function updateDB() {
  User.deleteMany()
    .then(() => {
      axios
        .get(
          `https://slack.com/api/channels.info?token=${
            process.env.TOKEN
          }&channel=${process.env.GROUP}&pretty=1`
        )
        .then(response => {
          console.log(response.data.channel.members);
          return Promise.all(
            response.data.channel.members.map(element => {
              return axios
                .get(
                  `https://slack.com/api/users.info?token=${
                    process.env.TOKEN
                  }&user=${element}&pretty=1`
                )

                .then(singleuser => {
                  const userData = singleuser.data.user;
                  const userProfile = singleuser.data.user.profile;
                  setLikes(userData);
                  setMatches(userData);
                  const newUser = new User();
                  newUser.slack_id = userData.id;
                  newUser.team_id = userData.team_id;
                  newUser.email = userProfile.email;
                  newUser.first_name = userProfile.first_name;
                  newUser.last_name = userProfile.last_name;
                  newUser.display_name = userProfile.display_name;
                  newUser.avatar_img = `https://ca.slack-edge.com/${
                    userData.team_id
                  }-${userData.id}-${userProfile.avatar_hash}-1024`;
                  newUser.avatar_hash = userProfile.avatar_hash;

                  return newUser
                    .save()
                    .then(result => {
                      console.log("User created");
                      return result;
                    })
                    .catch(error => {
                      console.log("Error to add a new user" + error);
                    });
                })
                .catch(() => {
                  console.log("Something went wrong during user consult");
                });
            })
          );
        })
        .then(() => {
          console.log(" Users creation Completed");
          // return mongoose.disconnect();
        })
        .then(() => {
          // console.log("Disconnect")
        })
        .catch(() => {
          console.log("Something went wrong during team consulting");
        });
    })
    .catch(err => {
      console.log(err);
      //  mongoose.disconnect();
    });
}

function setLikes(loggedUser) {
  return new Promise((res, rej) => {
    res(
      LikeDis.findOne({ slack_id: loggedUser.id }).then(likes => {
        if (likes === null) {
          const newLikedis = new LikeDis();
          newLikedis.slack_id = loggedUser.id;
          newLikedis.likes = [];
          newLikedis.dislikes = [loggedUser.id];
          return newLikedis
            .save()
            .then(newLikedis => {
              console.log("Like and Dislike table created");
              return newLikedis;
            })
            .catch(err => {
              console.log(err);
              console.log("Like and Dislike table creation went wrong");
            });
        } else {
          console.log("User's likes already exists");
          return likes;
        }
      })
    ).catch(() => {
      rej("algo falla");
      console.log("Something went wrong on user search");
    });
  });
}

function setMatches(loggedUser) {
  return Match.findOne({ slack_id: loggedUser.id })
    .then(matches => {
      if (matches === null) {
        const newMatch = new Match();
        newMatch.slack_id = loggedUser.id;
        newMatch.matches = [];
        return newMatch
          .save()
          .then(() => {
            console.log("Match table created");
            return newMatch;
          })
          .catch(() => {
            console.log("Match table creation went wrong");
          });
      } else {
        console.log("User's matches already exists");
        return matches;
      }
    })
    .catch(() => {
      console.log("Something was wrong during matches search");
    });
}
