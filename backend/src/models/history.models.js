import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: ["swapped", "bought", "sold"],
      required: true,
    },
    itemGivenId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
    itemReceivedId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
    otherUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    swapRequestId: { type: mongoose.Schema.Types.ObjectId, ref: "SwapRequest" },
  },
  { timestamps: { createdAt: "timestamp", updatedAt: false } },
);

export const History = mongoose.model("History", historySchema);
