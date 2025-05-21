import mongoose from "mongoose";
import { randomUUID } from "crypto";


const TeamSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.UUID,
      default: randomUUID,
      immutable: true,
    },
    teamName: {
      type: String,
      required: true,
    },
  },
);

export const TeamModel = mongoose.model("Teams", TeamSchema);
