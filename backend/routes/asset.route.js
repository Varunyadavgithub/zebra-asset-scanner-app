import express from "express";
import { fetchAssets } from "../controllers/asset.controller.js";

const router = express.Router();

router.get("/", fetchAssets);

export default router;
