import mongoose from "mongoose";
const Schema = new mongoose.Schema(
  {
    _id: {
      type: String,
    },
    userId: {
      type: String,
      required: true,
    },
    items: [
      {
        product: {
          type: String,
          required: true
        },
        quantity: {
          type: Number,
          required: true,
        }
      }
    ],
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    _id: false,
  }
);

export default mongoose.model("Car", Schema);
