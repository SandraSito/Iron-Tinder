require("dotenv").config();

const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const Chat = require("../models/Chat.js");
const Message = require("../models/Message.js");
const LikeDis = require("../models/Likes_dislikes.js");
const Match = require("../models/Matched.js");
const axios = require("axios");
const mongoose = require("mongoose");
const { ensureLoggedIn, ensureLoggedOut } = require("connect-ensure-login");




router.get('/myProfile', ensureLoggedIn("/"), (req, res) => {
  var frontInfo = {}
  User.findOne({ slack_id: req.user.id })
    .then((user) => {
      Promise.all([
        setLikes(user),
        setMatches(user),
        allUsers,
        getImgMatches(req.user.id),
        ])
        .then(data => {
          frontInfo = JSON.stringify({ user, userLikes: data[0], userMatches: data[1], list: data[2] });
          imgMatch=[];
          data[3].forEach(actualMatch=>{
            console.log(actualMatch);
            let img=`https://ca.slack-edge.com/${actualMatch.team_id}-${actualMatch.slack_id}-${actualMatch.avatar_hash}-1024`;
            imgMatch.push({img:img,id_invitado:actualMatch.slack_id})
          
          })
          console.log(imgMatch);
          res.render('profile/myProfile', { frontInfo, match:imgMatch,id:req.user.id });
        })
      })
    });


router.post("/like", (req, res) => {
  LikeDis.findOneAndUpdate(
    { slack_id: req.body.userLikesGlobal.slack_id },
    { $push: { likes: req.body.itemGlobal } },
    { new: true }
  )
    .then(response => {
      return res.json({ response });

    })
    .catch(err => console.log(err));
});
    



function getImgMatches (id){
  return Match.findOne({ slack_id: id })
  .then(match=>{
    return Promise.all(
      match.matches.map(match=>{
        return User.findOne({slack_id:match})
      })
    )
  })
}
    
router.post("/dislike", (req, res) => {
  LikeDis.findOneAndUpdate(
    { slack_id: req.body.userLikesGlobal.slack_id },
    { $push: { dislikes: req.body.itemGlobal } },
    { new: true }
  )
    .then(response => {
      return res.json({ response });
    })
    .catch(err => console.log(err));
});
    

router.post("/match", (req, res) => {
  return LikeDis.findOne({ slack_id: req.body.itemGlobal })
    .then(finded => {
      if (finded.likes.includes(req.body.userLikesGlobal.slack_id)) {
        console.log("MATCH");
        return Match.findOneAndUpdate(
          { slack_id: req.body.userLikesGlobal.slack_id },
          { $push: { matches: req.body.itemGlobal } },{new: true}
        )
          .then(result => {
            console.log("User Match added");
            console.log(result);
            return Match.findOneAndUpdate(
              { slack_id: req.body.itemGlobal },
              { $push: { matches: req.body.userLikesGlobal.slack_id } },{new: true}
            )
              .then(result => {
                if (result === null) {
                  const newMatch = new Match();
                  newMatch.slack_id = req.body.itemGlobal;
                  newMatch.matches = [req.body.userLikesGlobal.slack_id];
                  return newMatch
                    .save()
                    .then(result => {
                      console.log("Matched user table created and match added");
                       res.status(200).json({ result });
                    })
                    .catch(err => {
                      console.log("Match user table creation went wrong");
                      console.log(err);
                    });
                } else {
                  console.log("Matched user match added");
                   res.status(200).json({ result });
                }
              })
              .catch(err => {
                console.log(
                  "Something went wrong during MatchedUser Match addition"
                );
                console.log(err);
              });
          })
          .catch(err => {
            console.log("Something went wrong during User Match addition");
            console.log(err);
          });
      } else {
        console.log("NO MATCH");
         res.json({msg:null})
         return;
      }
    })
    .catch(err => {
      console.log(
        "Something went wrong during the findOne LikeDis table search"
      );
      console.log(err);
    });
});



router.post("/getuser", (req, res) => {
  return User.findOne({ slack_id: req.body.itemGlobal })
    .then(profile => {
      return res.status(200).json({ profile });
    })
    .catch(err => console.log(err));
});


router.post("/getprofile", (req, res) => {
  return User.findOne({ slack_id: req.body.user })
    .then(profile => {
      return res.status(200).json({ profile: profile });
    })
    .catch(err => console.log(err));
});

function setMatches(loggedUser) {
  return Match.findOne({ slack_id: loggedUser.slack_id })
    .then(matches => {
      if (matches === null) {
        const newMatch = new Match();
        newMatch.slack_id = loggedUser.slack_id;
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

function setLikes(loggedUser) {
  return new Promise((res, rej) => {
    res(
      LikeDis.findOne({ slack_id: loggedUser.slack_id }).then(likes => {
        if (likes === null) {
          const newLikedis = new LikeDis();
          newLikedis.slack_id = loggedUser.slack_id;
          newLikedis.likes = [];
          newLikedis.dislikes = [loggedUser.slack_id];
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

const allUsers = new Promise((res, rej) => {
  res(
    axios
      .get(
        `https://slack.com/api/channels.info?token=${
          process.env.TOKEN
        }&channel=${process.env.GROUP}&pretty=1`
      )
      .then(response => {
        return response.data.channel.members;
      })
      .catch(() => {
        console.log("Something went wrong creating users list");
        rej("somethings went wrong in axios petition to dislikes");
      })
  );
});

module.exports = router;
