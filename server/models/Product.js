import mongoose from "mongoose";
const redondeo = (number) => {
  let decimal = number % 1;
  let entero = Math.floor(number);
  let multiplo = Math.floor(entero / 100) * 100;
  if (decimal < 0.5) {
    return parseFloat(multiplo.toFixed(2));
  } else {
    return parseFloat((multiplo + 100).toFixed(2));
  }
};
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
    priceA: {
      type: Number,
    },
    priceB: {
      type: Number,
    },
  },
  {
    timestamps: true,
    _id: false,
  }
);
// Middleware to update priceA and priceB before saving
Schema.pre("save", function (next) {
    // Generar código de barras si no existe
    if (!this._id) {
      this._id = uuidv4();
      const barcodeSVG = JsBarcode(this._id).svg();
      this.barcode = barcodeSVG;
    }
    
  this.priceA = redondeo(this.price + (this.price * this.isLeave) / 100);
  this.priceB = redondeo(this.price + (this.price * this.isStay) / 100);
  next();
});

// Middleware to update priceA and priceB before findOneAndUpdate
Schema.pre("findOneAndUpdate", function (next) {
  const updatedFields = this.getUpdate();
  this._update.priceA = redondeo(
    updatedFields.price + (updatedFields.price * updatedFields.isLeave) / 100
  );
  this._update.priceB = redondeo(
    updatedFields.price + (updatedFields.price * updatedFields.isStay) / 100
  );
  next();
});

export default mongoose.model("Product", Schema);
