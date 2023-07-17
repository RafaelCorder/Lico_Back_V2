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
      default: 0,
    },
    amount: {
      type: Number,
      default: 0,
    },
    soldCount: {
      type: Number,
      default: 0,
    },
    iva: {
      type: Number,
      default: 0,
    },
    isRemove: {
      type: Boolean,
      default: false,
    },
    categoryId: {
      type: String,
      default: "Sin Categoria",
    },
    subCategoryId: {
      type: String,
      default: "Sin SubCategoria",
    },
    providerId: {
      type: String,
      default: "Sin Proveedor",
    },
    image: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg",
    },
    url: {
      type: String,
    },
    description: {
      type: String,
      default: "Sin descripcion",
    },
    isLeave: {
      type: Number,
      default: 0,
    },
    isStay: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    _id: false,
  }
);


export default mongoose.model("Product", Schema);
