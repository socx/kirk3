import express from "express";
import { 
  createPermission,
  getPermissions,
  getPermission,
  updatePermission,
} from "../controllers/permissionController";
import { validateToken } from "../middlewares/validateTokenHandler";

export const permissionRouter = express.Router();

permissionRouter.post("/", createPermission);
permissionRouter.get("/", validateToken, getPermissions);
permissionRouter.get("/:permissionId", validateToken, getPermission);
permissionRouter.patch("/:permissionId", validateToken, updatePermission);
