import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { SwapRequest } from "../models/swaprequests.models.js";
import { Item } from "../models/item.models.js";
import { User } from "../models/user.models.js";
import mongoose from "mongoose";

// Create a new swap request
const createSwapRequest = asyncHandler(async (req, res) => {
  const { requestedItemId, requesterItemId, message } = req.body;
  const requesterId = req.user._id;

  // Validation
  if (!requestedItemId || !requesterItemId) {
    throw new ApiError(400, "Both items are required for swap request");
  }

  if (!mongoose.Types.ObjectId.isValid(requestedItemId) || !mongoose.Types.ObjectId.isValid(requesterItemId)) {
    throw new ApiError(400, "Invalid item IDs");
  }

  // Check if items exist
  const requestedItem = await Item.findById(requestedItemId);
  const requesterItem = await Item.findById(requesterItemId);

  if (!requestedItem || !requesterItem) {
    throw new ApiError(404, "One or both items not found");
  }

  // Check if user owns the requester item
  if (requesterItem.ownerId.toString() !== requesterId.toString()) {
    throw new ApiError(403, "You can only swap items you own");
  }

  // Check if user is trying to swap with their own item
  if (requestedItem.ownerId.toString() === requesterId.toString()) {
    throw new ApiError(400, "You cannot swap with your own item");
  }

  // Check if requested item is available for swap
  if (!requestedItem.availableForSwap) {
    throw new ApiError(400, "This item is not available for swap");
  }

  // Check if there's already a pending swap request for these items
  const existingRequest = await SwapRequest.findOne({
    requesterId,
    requestedItemId,
    requesterItemId,
    status: "pending"
  });

  if (existingRequest) {
    throw new ApiError(400, "You have already sent a swap request for these items");
  }

  // Create swap request
  const swapRequest = await SwapRequest.create({
    requesterId,
    requesterItemId,
    requestedItemId,
    requesterMessage: message
  });

  // Populate the swap request with item and user details
  const populatedRequest = await SwapRequest.findById(swapRequest._id)
    .populate({
      path: 'requesterId',
      select: 'username fullName avatar'
    })
    .populate({
      path: 'requesterItemId',
      select: 'title description images category type size condition'
    })
    .populate({
      path: 'requestedItemId',
      select: 'title description images category type size condition ownerId',
      populate: {
        path: 'ownerId',
        select: 'username fullName avatar'
      }
    });

  return res.status(201).json(
    new ApiResponse(201, populatedRequest, "Swap request created successfully")
  );
});

// Get user's swap requests (sent by user)
const getMySwapRequests = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const userId = req.user._id;

  const query = { requesterId: userId };
  if (status) query.status = status;

  const swapRequests = await SwapRequest.find(query)
    .populate({
      path: 'requesterItemId',
      select: 'title description images category type size condition'
    })
    .populate({
      path: 'requestedItemId',
      select: 'title description images category type size condition ownerId',
      populate: {
        path: 'ownerId',
        select: 'username fullName avatar'
      }
    })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await SwapRequest.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(200, {
      swapRequests,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    }, "Swap requests retrieved successfully")
  );
});

// Get swap requests for user's items (received by user)
const getReceivedSwapRequests = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const userId = req.user._id;

  // Find items owned by the user
  const userItems = await Item.find({ ownerId: userId }).select('_id');
  const userItemIds = userItems.map(item => item._id);

  const query = { 
    requestedItemId: { $in: userItemIds },
    status: status || { $in: ['pending', 'accepted', 'rejected'] }
  };

  const swapRequests = await SwapRequest.find(query)
    .populate({
      path: 'requesterId',
      select: 'username fullName avatar'
    })
    .populate({
      path: 'requesterItemId',
      select: 'title description images category type size condition'
    })
    .populate({
      path: 'requestedItemId',
      select: 'title description images category type size condition'
    })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await SwapRequest.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(200, {
      swapRequests,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    }, "Received swap requests retrieved successfully")
  );
});

// Accept or reject a swap request
const respondToSwapRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const { action, message } = req.body; // action: 'accept' or 'reject'
  const userId = req.user._id;

  if (!['accept', 'reject'].includes(action)) {
    throw new ApiError(400, "Action must be 'accept' or 'reject'");
  }

  if (!mongoose.Types.ObjectId.isValid(requestId)) {
    throw new ApiError(400, "Invalid request ID");
  }

  const swapRequest = await SwapRequest.findById(requestId)
    .populate('requestedItemId');

  if (!swapRequest) {
    throw new ApiError(404, "Swap request not found");
  }

  // Check if user owns the requested item
  if (swapRequest.requestedItemId.ownerId.toString() !== userId.toString()) {
    throw new ApiError(403, "You can only respond to requests for your items");
  }

  // Check if request is still pending
  if (swapRequest.status !== 'pending') {
    throw new ApiError(400, "This request has already been responded to");
  }

  const newStatus = action === 'accept' ? 'accepted' : 'rejected';

  // Update the swap request
  const updatedRequest = await SwapRequest.findByIdAndUpdate(
    requestId,
    {
      status: newStatus,
      message: message || (action === 'accept' ? 'Swap request accepted!' : 'Swap request rejected.'),
      isReadByOwner: true
    },
    { new: true }
  ).populate([
    {
      path: 'requesterId',
      select: 'username fullName avatar'
    },
    {
      path: 'requesterItemId',
      select: 'title description images category type size condition'
    },
    {
      path: 'requestedItemId',
      select: 'title description images category type size condition'
    }
  ]);

  return res.status(200).json(
    new ApiResponse(200, updatedRequest, `Swap request ${action}ed successfully`)
  );
});

// Mark swap request as read
const markAsRead = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(requestId)) {
    throw new ApiError(400, "Invalid request ID");
  }

  const swapRequest = await SwapRequest.findById(requestId);

  if (!swapRequest) {
    throw new ApiError(404, "Swap request not found");
  }

  // Determine which user is marking as read
  let updateField = {};
  if (swapRequest.requesterId.toString() === userId.toString()) {
    updateField = { isReadByRequester: true };
  } else {
    // Check if user owns the requested item
    const requestedItem = await Item.findById(swapRequest.requestedItemId);
    if (requestedItem && requestedItem.ownerId.toString() === userId.toString()) {
      updateField = { isReadByOwner: true };
    } else {
      throw new ApiError(403, "You can only mark your own requests as read");
    }
  }

  const updatedRequest = await SwapRequest.findByIdAndUpdate(
    requestId,
    updateField,
    { new: true }
  );

  return res.status(200).json(
    new ApiResponse(200, updatedRequest, "Marked as read successfully")
  );
});

export {
  createSwapRequest,
  getMySwapRequests,
  getReceivedSwapRequests,
  respondToSwapRequest,
  markAsRead
}; 