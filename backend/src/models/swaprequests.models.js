import mongoose from "mongoose";

const swapRequestSchema = new mongoose.Schema(
  {
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requesterItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    requestedItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },
    message: {
      type: String,
      trim: true,
    },
    requesterMessage: {
      type: String,
      trim: true,
    },
    isReadByRequester: {
      type: Boolean,
      default: false,
    },
    isReadByOwner: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
swapRequestSchema.index({ requesterId: 1, status: 1 });
swapRequestSchema.index({ "requestedItemId.ownerId": 1, status: 1 });

export const SwapRequest = mongoose.model("SwapRequest", swapRequestSchema);
