import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: String,
    permissions: {
      type: [Number],
      default: [2001]
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    activatedAt: {
      type: Date,
    },
    deletedAt: {
      type: Date,
    },
  },
);

export const UserModel = mongoose.model("Users", UserSchema);
