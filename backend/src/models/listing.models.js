import mongoose from "mongoose";

const listingRequestSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    listingType: {
      type: String,
      enum: ["for_sale", "for_swap", "both"],
      required: true,
    },
    isLive: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const ListingRequest = mongoose.model(
  "ListingRequest",
  listingRequestSchema,
);
