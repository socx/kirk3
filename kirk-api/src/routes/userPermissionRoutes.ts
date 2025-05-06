import express from "express";

import {
  getUserPermissions,
  insertUserPermission,
  removeUserPermission,
} from "../controllers/userPermissionController";


export const userPermissionRouter = express.Router();


userPermissionRouter.post("/", insertUserPermission as any);
userPermissionRouter.get("/:userId", getUserPermissions as any)
userPermissionRouter.delete("/:userId/:permissionId", removeUserPermission as any)
