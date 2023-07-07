import mongoose from "mongoose";
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
      {
        _id:String,
        name:String
      }
    ]
  },
  {
    timestamps: true,
    _id:false
  }
);

export default mongoose.model("Bill", Schema);
