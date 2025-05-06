import express from "express";

import { registerUser, getAllUsers, getUser, loginUser, } from "../controllers/userController";

export const userRouter = express.Router();


userRouter.post("/register", registerUser as any);
userRouter.post("/authenticate", loginUser as any);
userRouter.get("/", getAllUsers as any)
userRouter.get("/:userId", getUser as any)
