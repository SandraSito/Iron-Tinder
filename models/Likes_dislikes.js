const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const likedisSchema = new Schema({
id: String,
likes: Array,
dislikes: Array
},{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Likedis = mongoose.model('Likedis', likedisSchema);
module.exports = Likedis;