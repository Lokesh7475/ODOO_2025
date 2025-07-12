import { Router } from "express";
import { getDashboardData } from "../controllers/dashboard.controller.js";

// Dashboard route
router.route("/dashboard").get(verifyJWT, getDashboardData);
