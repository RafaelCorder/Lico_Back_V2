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
    price: {
      type: Number,
      default:0
    },
    amount: {
      type: Number,
      default: 0
    },
    soldCount: {
      type: Number,
      default:0
    },
    iva: {
      type: Number,
      default: 0
    },
    isRemove: {
      type: Boolean,
      default: false,
    },
    categoryId:{
      type:String,
    },
    subCategoryId:{
      type:String,
    },
    image:{
      type: String,
      default: "https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
    },
    description:{
      type: String,
    }
  },
  {
    timestamps: true,
    _id: false,
  }
);



export default mongoose.model("Product", Schema);
