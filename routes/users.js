const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect('mongodb://localhost/pra');

const userSchema = mongoose.Schema({
  name: String,
  username: String,
  password: String,
  posts: [{
    type: String
  }]
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user',userSchema);