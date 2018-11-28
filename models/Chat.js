const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  mainUser: { type: Schema.Types.ObjectId, ref: 'User' },
  invitedUser: { type: Schema.Types.ObjectId, ref: 'User' }

}, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;