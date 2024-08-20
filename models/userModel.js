const mongoose = require("mongoose");
const env=require("dotenv")
env.config();
const uri = process.env.MongoDBURI;

mongoose.connect(uri);

const UserSchema = new mongoose.Schema({
  auth0_id: { type: String, unique: true },
  email: String,
  name: String,
});
const User = mongoose.model("User", UserSchema);
module.exports=User;