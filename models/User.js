const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  slack_id: {type: String, unique: true},
  team_id: String,
  email: String,
  first_name: String,
  last_name: String,
  display_name: String,
  avatar_img: String,
  avatar_hash: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
