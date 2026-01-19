import express from "express";
import {
  fetchAssets,
  createAssetScan,
} from "../controllers/asset.controller.js";

const router = express.Router();

router.get("/", fetchAssets);
router.post("/scan", createAssetScan);

export default router;
