import mongoose from "mongoose";
const Schema = new mongoose.Schema(
  {
    _id: {
      type: String,
    },
    fullName: {
      type: String,
      required: [true,"El nombre es requerido."],
    },
    nit: {
      type: String,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "El email es requerido."],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "La contraseña es requerida."],
    },
    rolId: {
      type: String,
      required: [true,"El rol es requerido."],
    },
    genderId: {
      type: String,
    },
    avatar: {
      type: String,
    },
    isRemove: {
      type: Boolean,
      default: false,
    },
    friends:[
      {
        _id:{
          type:String
        },
        name:{
          type:String
        }
      }
    ]
  },
  {
    timestamps: true,
    _id: false,
  }
);

export default mongoose.model("User", Schema);
