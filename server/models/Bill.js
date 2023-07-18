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
      default: true,
    },
    products:[
      Product.schema 
    ],
    paymentMethod:{
      type: String,
      default: "Efectivo"
    },
    type:{
      type: String,
      default: "Venta"
    },
    providerId: {
      type: String,
      required: function () {
        return this.type === "Compra";
      },
    },
  },
  {
    timestamps: true,
    _id:false
  }
);

export default mongoose.model("Bill", Schema);
