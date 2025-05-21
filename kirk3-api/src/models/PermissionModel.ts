import mongoose from "mongoose";
import { randomUUID } from "crypto";


const PermissionSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.UUID,
      default: randomUUID,
      immutable: true,
    },
    permissionName: {
      type: String,
      required: true,
    },
  },
);

export const PermissionModel = mongoose.model("Permissions", PermissionSchema);
