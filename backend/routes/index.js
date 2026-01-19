import { Router } from "express";
import assetRoutes from "./asset.route.js";

const routers = Router();

routers.use("/asset", assetRoutes);

export default routers;
