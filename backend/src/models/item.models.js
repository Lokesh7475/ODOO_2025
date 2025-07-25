import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    type: { type: String, enum: ["Male", "Female", "Unisex"] },
    size: { type: String },
    condition: { type: String, enum: ["New", "Like New", "Good", "Fair", "Used"] },
    price: { type: Number },
    availableForSwap: { type: Boolean, default: true },
    tags: [{ type: String }],
    images: [{ type: String }], // Cloudinary URLs
  },
  { timestamps: true },
);

export const Item = mongoose.model("Item", itemSchema);
