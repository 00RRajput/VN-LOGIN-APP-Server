const { Schema, model, Types, mongoose } = require("mongoose");

const userSchema = new Schema({
  user_name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  access_token: { type: String, default: null },
  refresh_token: { type: String, default: null },
  device_token: { type: String, default: null },
  isActive: { type: Boolean },
  created_at: { type: Date },
  updated_at: { type: Date },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
