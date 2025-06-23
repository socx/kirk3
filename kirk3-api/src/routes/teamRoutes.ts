import express from "express";

import {
  editTeam,
  getTeams,
  getTeam,
  insertTeam,
  removeTeam,
} from "../controllers/teamController";


export const teamRouter = express.Router();

teamRouter.post("/", insertTeam as any);
teamRouter.get("/", getTeams as any)
teamRouter.get("/:id", getTeam as any)
teamRouter.patch("/:id", editTeam as any)
teamRouter.delete("/:id", removeTeam as any)
