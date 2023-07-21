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
    const { _id, search, categoryId, subCategoryId, providerId } = filters;
    const { skip, limit } = handlePagination(options);
    let query = { isRemove: false };
    if (providerId) {
      query.providerId = providerId;
    }
    if (_id) {
      query._id = _id;
    }

    if (categoryId) {
      query.categoryId = categoryId;
    }

    if (subCategoryId) {
      query.subCategoryId = subCategoryId;
    }

    if (search) {
      const like = { $regex: search, $options: "i" };
      query.$or = [{ name: like }];
    }

    query.isRemove = false;

    const products = Product.aggregate([])
      .match(query)
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
        from: "providers",
        localField: "providerId",
        foreignField: "_id",
        as: "provider",
      })
      .addFields({
        nameLower: { $toLower: "$name" },
      })
      .sort({ nameLower: 1 })
      .unwind({ path: "$category", preserveNullAndEmptyArrays: true })
      .unwind({ path: "$subCategory", preserveNullAndEmptyArrays: true })
      .unwind({ path: "$provider", preserveNullAndEmptyArrays: true });

    if (skip) products.skip(skip);
    if (limit) products.limit(limit);

    return await products;
  } catch (error) {
    return error;
  }
};

const productsTotal = async () => await Product.count();
const Product_register = async (_, { productData }) => {
  try {
    const {
      name,
      price,
      amount,
      isStay,
      isLeave,
      iva,
      categoryId,
      subCategoryId,
      image,
      description,
      providerId
    } = productData;
    const productFound = await Product.find({ name });
    if (productFound.length === 0) {
      let url =
        "https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg";
      if (image) {
        const newImage = await Image_Save(image, "products");
        url = newImage.secure_url;
      }
      const product = new Product({
        _id: uuidv4(),
        name,
        price,
        isStay,
        isLeave,
        amount,
        iva,
        image: url,
        categoryId,
        subCategoryId,
        description,
        providerId
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
    const { _id, image } = productData;
    //console.log(productData);
    if (image) {
      const newImage = await Image_Save(image, "products");
      productData.image = newImage.secure_url;
    }
    const productUpdate = await Product.findByIdAndUpdate(_id, productData, {
      new: true,
    });
    pubsub.publish("UPDATE_PRODUCT", {
      subUpdateProduct: productUpdate,
    });
    return productUpdate._id;
  } catch (error) {
    Promise.reject(error)
  }
};
const Product_save = async (_, { productData = {} }) => {
  try {
    const { _id } = productData;
    const options = {
      create: Product_register,
      update: Product_update,
    }
    const option = _id?"update":"create"
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
  const product = await Product.findOne({ _id });
  try {
    if (
      product.image !==
      "https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
    ) {
      const publicId = product.image.match(/\/v\d+\/(\w+\/\w+)\./)[1];
      await cloudinary.uploader.destroy(publicId);
    }
    await Product.findOneAndDelete({ _id });
    return true;
  } catch (error) {
    return error;
  }
};
const Restart_soldCount = async() => {
  try {
    await Product.updateMany({},{$set:{soldCount:0}})
  return true
  } catch (e) {
    return e
  }
}
const subNewProduct = {
  subscribe: () => {
    return pubsub.asyncIterator(["CREATE_PRODUCT"]);
  },
};
const subUpdateProduct = {
  subscribe: () => {
    return pubsub.asyncIterator(["UPDATE_PRODUCT"]);
  },
};
export const productResolvers = {
  Query: {
    Products,
    productsTotal,
  },
  Mutation: {
    Product_save,
    Product_delete,
    Restart_soldCount,
  },
  Subscription: {
    subNewProduct,
    subUpdateProduct,
  },
  Upload: GraphQLUpload,
};
