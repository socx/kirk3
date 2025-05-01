import express from "express";

import { registerUser, getAllUsers } from "../controllers/userController";

export const userRouter = express.Router();


userRouter.post("/register", registerUser as any)
userRouter.get("/", getAllUsers as any)
