import { Router } from "express";

import {
  createListing,
  getListing,
  getListings,
  updateListing,
  deleteListing,
  getUserListings,
  searchListings,
  toggleListingStatus,
} from "../controllers/listing.controller.js";

import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes (no authentication required)
router.route("/").get(getListings); // Get all listings
router.route("/search").get(searchListings); // Search listings
router.route("/:id").get(getListing); // Get single listing by ID

// Protected routes (authentication required)
router.route("/create").post(verifyJWT, upload.array("images", 10), createListing); // Create new listing
router.route("/user").get(verifyJWT, getUserListings); // Get current user's listings

// Listing management routes
router.route("/:id").patch(verifyJWT, upload.array("images", 10), updateListing); // Update listing
router.route("/:id").delete(verifyJWT, deleteListing); // Delete listing
router.route("/:id/status").patch(verifyJWT, toggleListingStatus); // Toggle listing status (active/inactive)



export default router;
