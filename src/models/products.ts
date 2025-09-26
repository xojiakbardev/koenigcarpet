import { RugProduct } from "@/types/product";
import mongoose, { Schema, Model } from "mongoose";


const ProductSchema: Schema<RugProduct> = new Schema(
  {
    product_name: {
      en: { type: String, required: true },
      ru: { type: String },
      tr: { type: String },
    },
    description: {
      en: { type: String },
      ru: { type: String },
      tr: { type: String },
    },
    features: {
      head: { type: String },
      care_and_warranty: [{ type: String }],
      technical_info: [{ type: String }],
    },
    color: {
      en: { type: String },
      ru: { type: String },
      tr: { type: String },
      value: { type: String },
    },
    collection: {
      en: { type: String },
      ru: { type: String },
      tr: { type: String },
      value: { type: String },
    },
    style: {
      en: { type: String },
      ru: { type: String },
      tr: { type: String },
      value: { type: String },
    },
    product_code: { type: String },
    price: { type: Number, required: true },
    images: [{ type: String }],
    sizes: [{ type: String }],
    isNew: { type: Boolean, default: false },
    isRunners: { type: Boolean, default: false },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product: Model<RugProduct> =
  mongoose.models.Product || mongoose.model<RugProduct>("Product", ProductSchema);

export default Product;
