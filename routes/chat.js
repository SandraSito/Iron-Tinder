const express = require("express");
const passport = require('passport');
const router = express.Router();
const Chat = require("../models/Chat.js");
const Message = require("../models/Message.js");
const axios = require("axios");
const mongoose = require("mongoose");

router.get("/",(req,res)=>{
  res.render("profile/chat");
})

router.post("/", (req, res) => {
  let myId = req.body.myId;
  let otherId = req.body.otherId;
  // const { name, occupation, catchPhrase } = req.body;
  //   const newCelebrity = new Celebrity({ name, occupation, catchPhrase });
  Chat.findOne({ mainUser: myId, invitedUser: otherId })
    .then(chat => {
      if (chat !== null) {
        res.status(200).json(chat);
      } else {
        let {myId,otherId}=req.body;
        let myChat = new Chat({myId, otherId});
        console.log(myChat);
        return myChat.save()
          .then(res => {
            return res;
          })
          .catch(err => {

          })
      }
    })
    .catch(err => {

    })

})

module.exports = router;