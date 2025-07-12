import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ListingRequest } from "../models/listing.models.js";
import { Item } from "../models/item.models.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

// Create a new listing
const createListing = asyncHandler(async (req, res) => {
  const { title, description, category, type, size, tags, listingType, price } = req.body;

  // Validation
  if (!title || !listingType) {
    throw new ApiError(400, "Title and listing type are required");
  }

  if (!["for_sale", "for_swap", "both"].includes(listingType)) {
    throw new ApiError(400, "Invalid listing type. Must be 'for_sale', 'for_swap', or 'both'");
  }

  // Handle image uploads
  const imageUrls = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const uploadedImage = await uploadOnCloudinary(file.path);
      if (uploadedImage) {
        imageUrls.push(uploadedImage.url);
      }
    }
  }

  // Create item first
  const item = await Item.create({
    ownerId: req.user._id,
    title,
    description,
    category,
    type,
    size,
    tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
    images: imageUrls,
    price: price || null
  });

  // Create listing request
  const listing = await ListingRequest.create({
    itemId: item._id,
    listingType,
    isLive: true
  });

  // Populate the listing with item details
  const populatedListing = await ListingRequest.findById(listing._id)
    .populate({
      path: 'itemId',
      populate: {
        path: 'ownerId',
        select: 'username fullName avatar'
      }
    });

  return res.status(201).json(
    new ApiResponse(201, populatedListing, "Listing created successfully")
  );
});

// Get all listings
const getListings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, category, type, listingType } = req.query;

  const query = { isLive: true };
  
  if (category) query['itemId.category'] = category;
  if (type) query['itemId.type'] = type;
  if (listingType) query.listingType = listingType;

  const listings = await ListingRequest.find(query)
    .populate({
      path: 'itemId',
      populate: {
        path: 'ownerId',
        select: 'username fullName avatar'
      }
    })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await ListingRequest.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(200, {
      listings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    }, "Listings retrieved successfully")
  );
});

// Get single listing by ID
const getListing = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id)

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid listing ID");
  }

  const listing = await ListingRequest.findById(id)
    .populate({
      path: 'itemId',
      populate: {
        path: 'ownerId',
        select: 'username fullName avatar'
      }
    });

  if (!listing) {
    throw new ApiError(404, "Listing not found");
  }

  return res.status(200).json(
    new ApiResponse(200, listing, "Listing retrieved successfully")
  );
});

// Update listing
const updateListing = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, category, type, size, tags, listingType, price } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid listing ID");
  }

  const listing = await ListingRequest.findById(id)
    .populate('itemId');

  if (!listing) {
    throw new ApiError(404, "Listing not found");
  }

  // Check if user owns this listing
  if (listing.itemId.ownerId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only update your own listings");
  }

  // Handle image uploads
  const imageUrls = [...(listing.itemId.images || [])];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const uploadedImage = await uploadOnCloudinary(file.path);
      if (uploadedImage) {
        imageUrls.push(uploadedImage.url);
      }
    }
  }

  // Update item
  const updatedItem = await Item.findByIdAndUpdate(
    listing.itemId._id,
    {
      title,
      description,
      category,
      type,
      size,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : listing.itemId.tags,
      images: imageUrls,
      price: price || listing.itemId.price
    },
    { new: true }
  );

  // Update listing if listingType is provided
  let updatedListing = listing;
  if (listingType) {
    if (!["for_sale", "for_swap", "both"].includes(listingType)) {
      throw new ApiError(400, "Invalid listing type");
    }
    updatedListing = await ListingRequest.findByIdAndUpdate(
      id,
      { listingType },
      { new: true }
    ).populate({
      path: 'itemId',
      populate: {
        path: 'ownerId',
        select: 'username fullName avatar'
      }
    });
  } else {
    updatedListing = await ListingRequest.findById(id)
      .populate({
        path: 'itemId',
        populate: {
          path: 'ownerId',
          select: 'username fullName avatar'
        }
      });
  }

  return res.status(200).json(
    new ApiResponse(200, updatedListing, "Listing updated successfully")
  );
});

// Delete listing
const deleteListing = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid listing ID");
  }

  const listing = await ListingRequest.findById(id)
    .populate('itemId');

  if (!listing) {
    throw new ApiError(404, "Listing not found");
  }

  // Check if user owns this listing
  if (listing.itemId.ownerId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own listings");
  }

  // Delete the item and listing
  await Item.findByIdAndDelete(listing.itemId._id);
  await ListingRequest.findByIdAndDelete(id);

  return res.status(200).json(
    new ApiResponse(200, {}, "Listing deleted successfully")
  );
});

// Get user's listings
const getUserListings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const listings = await ListingRequest.find({ isLive: true })
    .populate({
      path: 'itemId',
      match: { ownerId: req.user._id },
      populate: {
        path: 'ownerId',
        select: 'username fullName avatar'
      }
    })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  // Filter out listings where itemId is null (items not owned by user)
  const userListings = listings.filter(listing => listing.itemId);

  const total = await ListingRequest.countDocuments({
    isLive: true,
    'itemId.ownerId': req.user._id
  });

  return res.status(200).json(
    new ApiResponse(200, {
      listings: userListings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    }, "User listings retrieved successfully")
  );
});

// Search listings
const searchListings = asyncHandler(async (req, res) => {
  const { 
    q, 
    category, 
    type, 
    listingType, 
    minPrice, 
    maxPrice, 
    page = 1, 
    limit = 10 
  } = req.query;

  const query = { isLive: true };

  // Build search query
  if (q) {
    query['itemId.title'] = { $regex: q, $options: 'i' };
  }
  if (category) query['itemId.category'] = category;
  if (type) query['itemId.type'] = type;
  if (listingType) query.listingType = listingType;
  if (minPrice || maxPrice) {
    query['itemId.price'] = {};
    if (minPrice) query['itemId.price'].$gte = parseFloat(minPrice);
    if (maxPrice) query['itemId.price'].$lte = parseFloat(maxPrice);
  }

  const listings = await ListingRequest.find(query)
    .populate({
      path: 'itemId',
      populate: {
        path: 'ownerId',
        select: 'username fullName avatar'
      }
    })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await ListingRequest.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(200, {
      listings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    }, "Search results retrieved successfully")
  );
});

// Toggle listing status
const toggleListingStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid listing ID");
  }

  const listing = await ListingRequest.findById(id)
    .populate('itemId');

  if (!listing) {
    throw new ApiError(404, "Listing not found");
  }

  // Check if user owns this listing
  if (listing.itemId.ownerId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only update your own listings");
  }

  const updatedListing = await ListingRequest.findByIdAndUpdate(
    id,
    { isLive: !listing.isLive },
    { new: true }
  ).populate({
    path: 'itemId',
    populate: {
      path: 'ownerId',
      select: 'username fullName avatar'
    }
  });

  return res.status(200).json(
    new ApiResponse(200, updatedListing, `Listing ${updatedListing.isLive ? 'activated' : 'deactivated'} successfully`)
  );
});



export {
  createListing,
  getListing,
  getListings,
  updateListing,
  deleteListing,
  getUserListings,
  searchListings,
  toggleListingStatus,
};
