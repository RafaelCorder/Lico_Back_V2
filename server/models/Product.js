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
    genderId: {
      type: String,
    },
    brandId: {
      type: String,
    },
    child: {
      type: Boolean,
      default:false
    },
    image:{
      type: String,
      default: "https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
    },
    size: [
      {
        name: String,
        available: Boolean,
        stock: {
          type: Number,
          validate: {
            validator: function(value) {
              return value >= 0;
            },
            message: "Stock must be a non-negative number."
          }
        }
      }
    ],
    description:{
      type: String,
    }
  },
  {
    timestamps: true,
    _id: false,
  }
);

Schema.pre('save', function(next) {
  this.size.forEach((sizeItem) => {
    sizeItem.available = sizeItem.stock > 0;
  });
  next();
});

export default mongoose.model("Product", Schema);
