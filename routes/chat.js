const express = require("express");
const passport = require('passport');
const router = express.Router();
const Chat = require("../models/Chat.js");
const Message = require("../models/Message.js");
const Match = require("../models/Matched.js");
const axios = require("axios");
const mongoose = require("mongoose");

router.get("/", (req, res) => {
  console.log();
  Match.find({ slack_id: req.user.id })
    .then(match => {
      res.render("profile/chat", { id: req.user.id, match: match });
    })
    .catch(err => console.log(err))

})

router.post("/", (req, res) => {
  const { mainUser, invitedUser } = req.body;
  const { creacion } = req.body;
  console.log(creacion)
  return Chat.find({$or: [{ mainUser: mainUser, invitedUser: invitedUser }, { mainUser: invitedUser, invitedUser: mainUser }]})
    .then(chat => {
      if (chat.length > 0) {
        console.log('abrimos chat');
        return res.status(200).json({ chat });
      } else {
        console.log('Creamos un nuevo chat');
        let myChat = new Chat({ mainUser, invitedUser });
        return myChat.save()
          .then(res => {
            return res;
          })
          .catch(err => {
            console.log('error al crear chat');
          })
      }
    })
    .catch(err => {
      console.log('error al buscar chat');
    })

})

router.post("/send", (req, res) => {
  let author_Id = req.body.mainUser;
  let chat_Id = req.body.idChat;
  let message = req.body.message;
  console.log(author_Id, chat_Id, message);
  myMessage = new Message({ author_Id, chat_Id, message });
  myMessage.save()
    .then(res => {
      console.log('Mensaje guardado correctamente');
    })
    .catch(err => {
      console.log('error al crear mensaje');
    })
  return res.status(200).json({ message: 'Ok' });
})

router.post("/print", (req, res) => {
  let chat_Id = req.body.idChat;
  return Message.find({ chat_Id: chat_Id })
    .then(respuesta => {
      return res.status(200).json({ respuesta:respuesta,slack_id: req.user.id });
    }).catch(err => {
      console.log(err);
    })
})


module.exports = router;