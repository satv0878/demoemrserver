var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
var Schema = mongoose.Schema;

/**
 * Create database scheme for notes
 */
const UserSchema = new Schema({
  userId: {
    type: String,
    unique: true
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  role: {
    type: String
  }
});

UserSchema.plugin(uniqueValidator);

var User = mongoose.model("User", UserSchema);

module.exports = User;
