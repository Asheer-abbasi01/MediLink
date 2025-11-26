// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, default: "user" }
// }, { timestamps: true });

// export const User = mongoose.model("User", userSchema);


import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" }, // "admin" or "user"
  isLoggedIn: { type: Boolean, default: false } // track if admin is currently logged in
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
