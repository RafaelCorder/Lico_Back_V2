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
    isRemove: {
      type: Boolean,
      default: false,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    products:[
      Product.schema 
    ],
    paymentMethod:{
      type: String,
      default: "Efectivo"
    }
  },
  {
    timestamps: true,
    _id:false
  }
);

export default mongoose.model("Bill", Schema);
