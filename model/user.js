const mongoose = require("mongoose");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "guest", "admin"], required: true },
  refreshToken: { type: String, required: true },
  passwordResetToken:  String ,
  passwordResetTokenExpires: Date,
});

UserSchema.methods.createResetPassordToken = function () {
  const resetToken = crypto.randomBytes(64).toString("hex");
  console.log(resetToken);
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  console.log(this)
  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
