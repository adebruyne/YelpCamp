var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  username: String,
  password: String
});

module.exports = mogoose.model("User", UserSchema);
