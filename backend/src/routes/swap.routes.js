import { Router } from "express";
import {
  createSwapRequest,
  getUserSwapRequests,
  getSwapRequest,
  acceptSwapRequest,
  rejectSwapRequest,
  cancelSwapRequest,
} from "../controllers/swap.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(verifyJWT);

// Create a new swap request
router.route("/create").post(createSwapRequest);

// Get user's swap requests (all, sent, or received)
router.route("/").get(getUserSwapRequests);

// Get single swap request
router.route("/:swapRequestId").get(getSwapRequest);

// Accept a swap request
router.route("/:swapRequestId/accept").patch(acceptSwapRequest);

// Reject a swap request
router.route("/:swapRequestId/reject").patch(rejectSwapRequest);

// Cancel a swap request (by requester)
router.route("/:swapRequestId/cancel").patch(cancelSwapRequest);

export default router; 