import mongoose from "mongoose";
const Schema = new mongoose.Schema(
  {
    _id: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    email: {
      type: String,
    },
    image: {
      type: String,
    },
    isRemove: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    _id:false
  }
);

export default mongoose.model("Company", Schema);
