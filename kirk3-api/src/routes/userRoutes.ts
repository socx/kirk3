import express from "express";
import { changePassword, completeUserSignUp, getAllUsers, getUser, initiatePasswordReset, loginUser, logoutUser, registerUser, } from "../controllers/userController";
import { validateToken } from "../middlewares/validateTokenHandler";
export const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.patch("/:email/activate-user", completeUserSignUp);
userRouter.post("/authenticate", loginUser);
userRouter.get("/logout", logoutUser);
userRouter.post("/initiate-password-reset", initiatePasswordReset);
userRouter.post("/:email/change-password", changePassword);

userRouter.get("/", validateToken, getAllUsers);
userRouter.get("/:id", validateToken, getUser);

