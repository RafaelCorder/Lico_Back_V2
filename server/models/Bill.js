import mongoose from "mongoose";
import Product from "./Product.js";
const Schema = new mongoose.Schema(
  {
    _id: {
      type: String,
    },
    billNumber: {
      type: String,
    },
    tableId: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      default: 0,
    },
    isRemove: {
      type: Boolean,
      default: false,
    },
    isPaid: {
      type: Boolean,
      default: true,
    },
    products: [Product.schema],
    paymentMethod: {
      type: String,
      default: "Efectivo",
    },
    type: {
      type: String,
      default: "Venta",
      index: true,
    },
    seller: {
      type: {
        _id: String,
        fullName: String,
        rolId: String,
        email: String,
        nit: String,
        phone: String,
      },
    },
    company: {
      type: {
        name: String,
        address: String,
        email: String,
      },
    },
    dateInfo: {
      type: {
        datetime: Date,
        day: Number,
        month: Number,
        year: Number,
        hours: Number,
        minuts: Number,
        seconds: Number,
        weekNumber: Number,
        dayName: String,
        monthName: String,
      },
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
    _id: false,
  }
);
Schema.pre("save", async function (next) {
  try {
    // Check if the document is newly created (not being updated)
    if (this.isNew) {
      const Bill = mongoose.model("Bill");
      let lastBill = {};
      if (this.type === "Venta") {
        lastBill = await Bill.findOne(
          { type: "Venta" },
          {},
          { sort: { billNumber: -1 } }
        );
      }
      if (this.type === "Compra") {
        lastBill = await Bill.findOne(
          { type: "Compra" },
          {},
          { sort: { billNumber: -1 } }
        );
      }
      
      const newBillNumber = lastBill ? parseInt(lastBill.billNumber) + 1 : 1;
      this.billNumber = newBillNumber;
    }

    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("Bill", Schema);
