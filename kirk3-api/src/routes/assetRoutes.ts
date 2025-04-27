import express from "express";

import { createAsset, getLinkedUserAssets, linkUserAssets } from "../controllers/assetController";
import { validateToken } from "../middlewares/validateTokenHandler";

export const assetRouter = express.Router();

assetRouter.post("/", validateToken, createAsset);
assetRouter.patch("/link-to-user", validateToken, linkUserAssets);
assetRouter.get("/linked", validateToken, getLinkedUserAssets);
