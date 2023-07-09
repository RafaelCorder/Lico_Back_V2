import mongoose from "mongoose";
import Product from "./Product.js"
const Schema = new mongoose.Schema(
  {
    _id: {
      type: String,
    },
    tableId: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      default: 0
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    isRemove: {
      type: Boolean,
      default: false,
    },
    products:[
      Product.schema 
    ]
  },
  {
    timestamps: true,
    _id:false
  }
);

export default mongoose.model("Bill", Schema);
