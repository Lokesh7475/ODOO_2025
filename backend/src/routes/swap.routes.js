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

// ===========================================
// AUTHENTICATION MIDDLEWARE
// ===========================================
router.use(verifyJWT);

// ===========================================
// SWAP REQUEST MANAGEMENT
// ===========================================

// Create a new swap request
router.route("/create").post(createSwapRequest);

// Get user's swap requests (sent, received, or all)
router.route("/user").get(getUserSwapRequests);

// Get single swap request by ID
router.route("/:swapRequestId").get(getSwapRequest);

// ===========================================
// SWAP REQUEST ACTIONS
// ===========================================

// Accept a swap request (by responder)
router.route("/:swapRequestId/accept").patch(acceptSwapRequest);

// Reject a swap request (by responder)
router.route("/:swapRequestId/reject").patch(rejectSwapRequest);

// Cancel a swap request (by requester)
router.route("/:swapRequestId/cancel").patch(cancelSwapRequest);

export default router; 