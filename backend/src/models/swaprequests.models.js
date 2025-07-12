const mongoose = require("mongoose");

const swapRequestSchema = new mongoose.Schema(
  {
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
    isAccepted: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const SwapRequest = mongoose.model("SwapRequest", swapRequestSchema);
