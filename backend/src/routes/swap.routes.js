import { Router } from "express";
import {
  createSwapRequest,
  getMySwapRequests,
  getReceivedSwapRequests,
  respondToSwapRequest,
  markAsRead,
} from "../controllers/swap.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(verifyJWT);

// Create a new swap request
router.route("/create").post(createSwapRequest);

// Get user's swap requests (sent by user)
router.route("/my-requests").get(getMySwapRequests);

// Get swap requests for user's items (received by user)
router.route("/received").get(getReceivedSwapRequests);

// Respond to a swap request (accept/reject)
router.route("/:requestId/respond").patch(respondToSwapRequest);

// Mark swap request as read
router.route("/:requestId/read").patch(markAsRead);

export default router; 