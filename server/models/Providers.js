import mongoose from "mongoose";

const ProvidersSchema = new mongoose.Schema({
    _id: {
        type: String,
      },
    name:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        default: "N/A"
    },
    address:{
        type: String,
        default: "N/A"
    },
    salesManager:{
        type: String,
        default: "N/A"
    },
    email:{
        type: String,
        default: "N/A"
    },
    
},
{
    timestamps: true,
    _id:false
  }
)
export default mongoose.model('Providers', ProvidersSchema)