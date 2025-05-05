import express from "express";

import {
  getPermissions,
  getPermission,
  insertPermission,
  editPermission,
  removePermission,
} from "../controllers/permissionController";


export const permissionRouter = express.Router();


permissionRouter.post("/", insertPermission as any);
permissionRouter.patch("/", editPermission as any);
permissionRouter.get("/", getPermissions as any)
permissionRouter.get("/:id", getPermission as any)
permissionRouter.delete("/:id", removePermission as any)
