import Product from "../../models/Product.js";
import { v4 as uuidv4 } from "uuid";
import pkg from "@codecraftkit/utils";
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import { Image_Save } from "../../config/imageSave.js";
import { pubsub } from "../schema.js";
import cloudinary from "cloudinary";
const { handlePagination } = pkg;


const Products = async (_, { filters = {}, options = {} }) => {
  try {
    const { _id, search, genderId, categoryId, subCategoryId, brandId, child } =
      filters;
    const { skip, limit } = handlePagination(options);
    let query = { isRemove: false };
    if (_id) {
      query = { _id, isRemove: false };
    }
    if (genderId && !brandId) {
      query = { genderId, isRemove: false };
    }
    if (genderId && brandId) {
      query = { genderId, brandId, isRemove: false };
    }
    if (search) {
      const like = { $regex: search, $options: "i" };
      query = {
        $or: [{ name: like }],
        isRemove: false,
      };
    }
    const products = Product.aggregate([])
      .match(query)
      .lookup({
        from: "genders",
        localField: "genderId",
        foreignField: "_id",
        as: "gender",
      })
      .lookup({
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
      })
      .lookup({
        from: "subcategories",
        localField: "subCategoryId",
        foreignField: "_id",
        as: "subCategory",
      })
      .lookup({
        from: "brands",
        localField: "brandId",
        foreignField: "_id",
        as: "brand",
      })
      .addFields({
        nameLower: { $toLower: "$name" }, // Agregar campo con nombre en minúscula
      })
      .sort({ nameLower: 1 })
      .unwind({ path: "$gender", preserveNullAndEmptyArrays: true })
      .unwind({ path: "$brand", preserveNullAndEmptyArrays: true })
      .unwind({ path: "$category", preserveNullAndEmptyArrays: true })
      .unwind({ path: "$subCategory", preserveNullAndEmptyArrays: true });
    if (skip) products.skip(skip);
    if (limit) products.limit(limit);
    return await products;
  } catch (error) {
    return error;
  }
};
const Product_register = async (_, { productData }) => {
  try {
    const {
      name,
      price,
      iva,
      genderId,
      categoryId,
      subCategoryId,
      child,
      brandId,
      image,
      size,
      description,
    } = productData;

    const productFound = await Product.find({ name });

    if (productFound.length === 0) {
      const amount = size.reduce(
        (total, sizeItem) => total + sizeItem.stock,
        0
      );
      let url = null;
      if (image) {
        const newImage = await Image_Save(image, "products");
        url = newImage.secure_url;
      }
      const product = new Product({
        _id: uuidv4(),
        name,
        price,
        amount,
        iva,
        image: url,
        genderId,
        categoryId,
        subCategoryId,
        child,
        brandId,
        size,
        description,
      });
      const newProduct = await product.save();
      pubsub.publish("CREATE_PRODUCT", {
        subNewProduct: newProduct,
      });
      return newProduct._id;
    } else {
      return false;
    }
  } catch (error) {
    return error;
  }
};
const Product_update = async (_, { productData = {} }) => {
  try {
    const productUpdate = await Product.findByIdAndUpdate(
      productData._id,
      productData,
      {
        new: true,
      }
    );
    return productUpdate._id;
  } catch (error) {
    return error;
  }
};
const Product_save = async (_, { productData = {} }) => {
  try {
    const { _id } = productData;
    if (_id) {
      return await Product_update(_, { productData });
    } else {
      return await Product_register(_, { productData });
    }
  } catch (e) {
    return e;
  }
};
const Product_delete = async (_, { _id }) => {
  const product = await Product.findOne({_id});
  try {
    const publicId = product.image.match(/\/v\d+\/(\w+\/\w+)\./)[1];
    await cloudinary.uploader.destroy(publicId);
    await Product.findOneAndDelete({_id});
    return true;
  } catch (error) {
    return error;
  }
};
const subNewProduct = {
  subscribe: () => {
    console.log("suscrito");
    return pubsub.asyncIterator(["CREATE_PRODUCT"]);
  },
};
export const productResolvers = {
  Query: {
    Products,
  },
  Mutation: {
    Product_save,
    Product_delete,
  },
  Subscription: {
    subNewProduct,
  },
  Upload: GraphQLUpload,
};
