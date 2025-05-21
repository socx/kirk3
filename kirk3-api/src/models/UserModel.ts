import mongoose from "mongoose";
import { randomUUID } from "crypto";


const UserSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.UUID,
      default: randomUUID,
      immutable: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    accessToken: String,
    team: {
      type: String,
    },
    permissions: [{
      type: mongoose.Schema.Types.UUID,
      ref: "Permission",
      index: true,
    }],
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
