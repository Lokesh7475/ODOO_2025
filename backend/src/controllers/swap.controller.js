import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { SwapRequest } from "../models/swaprequests.models.js";
import { Item } from "../models/item.models.js";
import { ListingRequest } from "../models/listing.models.js";
import { History } from "../models/history.models.js";
import mongoose from "mongoose";

// ===========================================
// CREATE SWAP REQUEST
// ===========================================
const createSwapRequest = asyncHandler(async (req, res) => {
  const { itemToBeSwappedForId, itemToBeSwappedId, message } = req.body;
  const requesterId = req.user._id;

  // Validation
  if (!itemToBeSwappedForId || !itemToBeSwappedId) {
    throw new ApiError(400, "Both item IDs are required");
  }

  if (!mongoose.Types.ObjectId.isValid(itemToBeSwappedForId) || 
      !mongoose.Types.ObjectId.isValid(itemToBeSwappedId)) {
    throw new ApiError(400, "Invalid item ID format");
  }

  // Find the item the user wants to swap for
  const itemToBeSwappedFor = await Item.findById(itemToBeSwappedForId)
    .populate('ownerId', 'username fullName');

  if (!itemToBeSwappedFor) {
    throw new ApiError(404, "Item you want to swap for not found");
  }

  // Find the user's item they want to swap
  const itemToBeSwapped = await Item.findById(itemToBeSwappedId);

  if (!itemToBeSwapped) {
    throw new ApiError(404, "Your item not found");
  }

  // Check if user owns the item they want to swap
  if (itemToBeSwapped.ownerId.toString() !== requesterId.toString()) {
    throw new ApiError(403, "You can only swap items you own");
  }

  // Check if user is trying to swap with themselves
  if (itemToBeSwappedFor.ownerId._id.toString() === requesterId.toString()) {
    throw new ApiError(400, "You cannot swap with yourself");
  }

  // Check if the item is available for swap
  const listingForItem = await ListingRequest.findOne({
    itemId: itemToBeSwappedForId,
    isLive: true
  });

  if (!listingForItem) {
    throw new ApiError(400, "Item is not available for swap");
  }

  if (!["for_swap", "both"].includes(listingForItem.listingType)) {
    throw new ApiError(400, "This item is not available for swap");
  }

  // Check for existing swap request
  const existingSwapRequest = await SwapRequest.findOne({
    $or: [
      {
        itemToBeSwapped: itemToBeSwappedId,
        itemToBeSwappedFor: itemToBeSwappedForId,
        requesterId: requesterId,
        responderId: itemToBeSwappedFor.ownerId._id
      },
      {
        itemToBeSwapped: itemToBeSwappedForId,
        itemToBeSwappedFor: itemToBeSwappedId,
        requesterId: requesterId,
        responderId: itemToBeSwappedFor.ownerId._id
      }
    ],
    isAccepted: { $ne: true }
  });

  if (existingSwapRequest) {
    throw new ApiError(400, "A swap request already exists for these items");
  }

  // Create the swap request
  const swapRequest = await SwapRequest.create({
    itemToBeSwapped: itemToBeSwappedId,
    itemToBeSwappedFor: itemToBeSwappedForId,
    requesterId: requesterId,
    responderId: itemToBeSwappedFor.ownerId._id,
    message: message,
    isAccepted: false
  });

  // Populate and return
  const populatedSwapRequest = await SwapRequest.findById(swapRequest._id)
    .populate({
      path: 'itemToBeSwapped',
      populate: { path: 'ownerId', select: 'username fullName avatar' }
    })
    .populate({
      path: 'itemToBeSwappedFor',
      populate: { path: 'ownerId', select: 'username fullName avatar' }
    })
    .populate('requesterId', 'username fullName avatar')
    .populate('responderId', 'username fullName avatar');

  return res.status(201).json(
    new ApiResponse(201, populatedSwapRequest, "Swap request created successfully")
  );
});

// ===========================================
// GET USER'S SWAP REQUESTS
// ===========================================
const getUserSwapRequests = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 10, type = "all" } = req.query;

  let query = {};
  
  switch (type) {
    case "sent":
      query.requesterId = userId;
      break;
    case "received":
      query.responderId = userId;
      break;
    default:
      query.$or = [{ requesterId: userId }, { responderId: userId }];
  }

  const swapRequests = await SwapRequest.find(query)
    .populate({
      path: 'itemToBeSwapped',
      populate: { path: 'ownerId', select: 'username fullName avatar' }
    })
    .populate({
      path: 'itemToBeSwappedFor',
      populate: { path: 'ownerId', select: 'username fullName avatar' }
    })
    .populate('requesterId', 'username fullName avatar')
    .populate('responderId', 'username fullName avatar')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await SwapRequest.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(200, {
      swapRequests,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    }, "Swap requests retrieved successfully")
  );
});

// ===========================================
// GET SINGLE SWAP REQUEST
// ===========================================
const getSwapRequest = asyncHandler(async (req, res) => {
  const { swapRequestId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(swapRequestId)) {
    throw new ApiError(400, "Invalid swap request ID");
  }

  const swapRequest = await SwapRequest.findById(swapRequestId)
    .populate({
      path: 'itemToBeSwapped',
      populate: { path: 'ownerId', select: 'username fullName avatar' }
    })
    .populate({
      path: 'itemToBeSwappedFor',
      populate: { path: 'ownerId', select: 'username fullName avatar' }
    })
    .populate('requesterId', 'username fullName avatar')
    .populate('responderId', 'username fullName avatar');

  if (!swapRequest) {
    throw new ApiError(404, "Swap request not found");
  }

  // Check if user is involved in this swap request
  if (swapRequest.requesterId._id.toString() !== userId.toString() && 
      swapRequest.responderId._id.toString() !== userId.toString()) {
    throw new ApiError(403, "You can only view swap requests you're involved in");
  }

  return res.status(200).json(
    new ApiResponse(200, swapRequest, "Swap request retrieved successfully")
  );
});

// ===========================================
// ACCEPT SWAP REQUEST
// ===========================================
const acceptSwapRequest = asyncHandler(async (req, res) => {
  const { swapRequestId } = req.params;
  const responderId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(swapRequestId)) {
    throw new ApiError(400, "Invalid swap request ID");
  }

  const swapRequest = await SwapRequest.findById(swapRequestId)
    .populate('itemToBeSwapped')
    .populate('itemToBeSwappedFor');

  if (!swapRequest) {
    throw new ApiError(404, "Swap request not found");
  }

  // Check if the user is the responder
  if (swapRequest.responderId.toString() !== responderId.toString()) {
    throw new ApiError(403, "You can only accept swap requests for your items");
  }

  if (swapRequest.isAccepted) {
    throw new ApiError(400, "Swap request has already been accepted");
  }

  // Check if both items are still available
  const itemToBeSwappedListing = await ListingRequest.findOne({
    itemId: swapRequest.itemToBeSwapped._id,
    isLive: true
  });

  const itemToBeSwappedForListing = await ListingRequest.findOne({
    itemId: swapRequest.itemToBeSwappedFor._id,
    isLive: true
  });

  if (!itemToBeSwappedListing || !itemToBeSwappedForListing) {
    throw new ApiError(400, "One or both items are no longer available");
  }

  // Accept the swap request
  swapRequest.isAccepted = true;
  await swapRequest.save();

  // Transfer ownership of items
  await Item.findByIdAndUpdate(swapRequest.itemToBeSwapped._id, {
    ownerId: swapRequest.responderId
  });

  await Item.findByIdAndUpdate(swapRequest.itemToBeSwappedFor._id, {
    ownerId: swapRequest.requesterId
  });

  // Mark listings as not live
  await ListingRequest.findByIdAndUpdate(itemToBeSwappedListing._id, {
    isLive: false
  });

  await ListingRequest.findByIdAndUpdate(itemToBeSwappedForListing._id, {
    isLive: false
  });

  // Create history records for both users
  await History.create([
    {
      userId: swapRequest.requesterId,
      action: "swapped",
      itemGivenId: swapRequest.itemToBeSwapped._id,
      itemReceivedId: swapRequest.itemToBeSwappedFor._id,
      otherUserId: swapRequest.responderId,
      swapRequestId: swapRequest._id
    },
    {
      userId: swapRequest.responderId,
      action: "swapped",
      itemGivenId: swapRequest.itemToBeSwappedFor._id,
      itemReceivedId: swapRequest.itemToBeSwapped._id,
      otherUserId: swapRequest.requesterId,
      swapRequestId: swapRequest._id
    }
  ]);

  // Return populated swap request
  const updatedSwapRequest = await SwapRequest.findById(swapRequestId)
    .populate({
      path: 'itemToBeSwapped',
      populate: { path: 'ownerId', select: 'username fullName avatar' }
    })
    .populate({
      path: 'itemToBeSwappedFor',
      populate: { path: 'ownerId', select: 'username fullName avatar' }
    })
    .populate('requesterId', 'username fullName avatar')
    .populate('responderId', 'username fullName avatar');

  return res.status(200).json(
    new ApiResponse(200, updatedSwapRequest, "Swap request accepted successfully")
  );
});

// ===========================================
// REJECT SWAP REQUEST
// ===========================================
const rejectSwapRequest = asyncHandler(async (req, res) => {
  const { swapRequestId } = req.params;
  const responderId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(swapRequestId)) {
    throw new ApiError(400, "Invalid swap request ID");
  }

  const swapRequest = await SwapRequest.findById(swapRequestId);

  if (!swapRequest) {
    throw new ApiError(404, "Swap request not found");
  }

  // Check if the user is the responder
  if (swapRequest.responderId.toString() !== responderId.toString()) {
    throw new ApiError(403, "You can only reject swap requests for your items");
  }

  if (swapRequest.isAccepted) {
    throw new ApiError(400, "Cannot reject an already accepted swap request");
  }

  // Delete the swap request
  await SwapRequest.findByIdAndDelete(swapRequestId);

  return res.status(200).json(
    new ApiResponse(200, {}, "Swap request rejected successfully")
  );
});

// ===========================================
// CANCEL SWAP REQUEST
// ===========================================
const cancelSwapRequest = asyncHandler(async (req, res) => {
  const { swapRequestId } = req.params;
  const requesterId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(swapRequestId)) {
    throw new ApiError(400, "Invalid swap request ID");
  }

  const swapRequest = await SwapRequest.findById(swapRequestId);

  if (!swapRequest) {
    throw new ApiError(404, "Swap request not found");
  }

  // Check if the user is the requester
  if (swapRequest.requesterId.toString() !== requesterId.toString()) {
    throw new ApiError(403, "You can only cancel your own swap requests");
  }

  if (swapRequest.isAccepted) {
    throw new ApiError(400, "Cannot cancel an already accepted swap request");
  }

  // Delete the swap request
  await SwapRequest.findByIdAndDelete(swapRequestId);

  return res.status(200).json(
    new ApiResponse(200, {}, "Swap request cancelled successfully")
  );
});

export {
  createSwapRequest,
  getUserSwapRequests,
  getSwapRequest,
  acceptSwapRequest,
  rejectSwapRequest,
  cancelSwapRequest,
}; 