import { Image_Save } from "../../config/imageSave.js";
import Brand from "../../models/Brand.js";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "cloudinary";
import { pubsub } from "../schema.js";

const Brands = async (_,__,{session}) => {
  try {
    let query = {};
    const brands = await Brand.aggregate([]).match(query).lookup({
      from: "products",
      localField: "_id",
      foreignField: "brandId",
      as: "products",
    })
    .addFields({
      nameLower: { $toLower: "$name" } // Agregar campo con nombre en minúscula
    })
    .sort({ nameLower: 1 })
    return brands;
  } catch (error) {
    return error;
  }
};
const Brand_register = async (_, { brandData = {} }) => {
  try {
    const { name, image } = brandData;
    const brandFound = await Brand.find({ name });
    if (brandFound.length === 0) {
      let url = null
      if (image) {
        const newImage = await Image_Save(image, "brands");
        url = newImage.secure_url;
      }
      const brand = new Brand({
        _id: uuidv4(),
        name,
        image: url,
      });
      const newBrand = await brand.save();
      pubsub.publish("CREATE_BRAND", {
        subNewBrand: newBrand,
      });
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return error;
  }
};
const Brand_update = async (_, { brandData = {} }) => {
  try {
    await Brand.findByIdAndUpdate(brandData._id, brandData, {
      new: true,
    });
    return true;
  } catch (error) {
    return error;
  }
};
const Brand_save = async (_, { brandData = {} }) => {
  try {
    const { _id } = brandData;
    if (_id) {
      return await Brand_update(_, { brandData });
    } else {
      return await Brand_register(_, { brandData });
    }
  } catch (error) {
    return error;
  }
};
const Brand_delete = async (_, { _id }) => {
  const brand = await Brand.findOne({_id});
  if (brand) {
    try {
      const publicId = brand.image.match(/\/v\d+\/(\w+\/\w+)\./)[1];
      await cloudinary.uploader.destroy(publicId);
      await Brand.findOneAndDelete({_id});
      return true;
    } catch (error) {
      return error;
    }
  } else {
    false;
  }
};
const subNewBrand = {
  subscribe: () => {
    console.log("suscrito");
    return pubsub.asyncIterator(["CREATE_BRAND"]);
  },
};
export const brandResolvers = {
  Query: {
    Brands,
  },
  Mutation: {
    Brand_delete,
    Brand_save,
  },
  Subscription: {
    subNewBrand,
  },
};
