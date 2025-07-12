import mongoose from "mongoose";

const swapRequestSchema = new mongoose.Schema(
  {
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    responderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    itemToBeSwapped: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    itemToBeSwappedFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      trim: true,
    },
    isReadByRequester: {
      type: Boolean,
      default: false,
    },
    isReadByResponder: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Indexes for efficient queries
swapRequestSchema.index({ requesterId: 1, isAccepted: 1 });
swapRequestSchema.index({ responderId: 1, isAccepted: 1 });
swapRequestSchema.index({ itemToBeSwapped: 1, itemToBeSwappedFor: 1 });

export const SwapRequest = mongoose.model("SwapRequest", swapRequestSchema);
