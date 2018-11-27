require("dotenv").config();


const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const axios = require("axios");


mongoose
  .connect(
    `mongodb:${process.env.DBPATH}`,
    { useNewUrlParser: true }
  )
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
    crearCollections();
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

function crearCollections() {
  Chat.create(function (err, small) {
    console.log('Chat created');
    if (err) return handleError(err);
    // saved!
  })

  Message.create(function (err, small) {
    console.log('Message created');
    if (err) return handleError(err);
    // saved!
  })

}
