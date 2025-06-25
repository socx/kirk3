import express from "express";

import { downloadFile, } from "../controllers/fileController";


export const fileRouter = express.Router();

fileRouter.get("/:fileName", downloadFile as any);
