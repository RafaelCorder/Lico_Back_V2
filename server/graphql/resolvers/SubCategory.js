import SubCategory from "../../models/SubCategory.js";
import { v4 as uuidv4 } from "uuid";
import pkg from "@codecraftkit/utils";
const { handlePagination } = pkg;

const SubCategories = async (_, { filters = {}, options = {} }) => {
  try {
    const { skip, limit } = handlePagination(options);
    const { categoryId, search, _id } = filters;
    let query = {};
    if (categoryId) {
      query =  {categoryId} ;
    }
    if (_id) {
      query =  {_id} ;
    }
    if (search) {
      const like = { $regex: search, $options: "i" };
      query = {
        $or: [
          { name: like },
        ],
      };
    }
    const subCategories = SubCategory.aggregate([])
      .match(query)
      .lookup({
        from: "products",
        localField: "_id",
        foreignField: "subCategoryId",
        as: "products",
      })
      .lookup({
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
      })
      .addFields({
        nameLower: { $toLower: "$name" }, // Agregar campo con nombre en minúscula
      })
      .sort({ nameLower: 1 })
      .unwind({ path: "$category", preserveNullAndEmptyArrays: true });
      if (skip) subCategories.skip(skip);
    if (limit) subCategories.limit(limit);
    return await subCategories;
  } catch (error) {
    return error;
  }
};
const subCategoriesTotal = async () => await SubCategory.count();
const SubCategory_register = async (_, { subCategoryData = {} }) => {
  try {
    const { name, categoryId } = subCategoryData;
    const subCategoryFound = await SubCategory.find({ name });
    if (subCategoryFound.length === 0) {
      const subCategory = new SubCategory({
        _id: uuidv4(),
        name,
        categoryId,
      });
      await subCategory.save();
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return error;
  }
};
const SubCategory_update = async (_, { subCategoryData = {} }) => {
  try {
    await SubCategory.findOneAndUpdate(subCategoryData._id, subCategoryData, {
      new: true,
    });
    return true;
  } catch (error) {
    return error;
  }
};
const SubCategory_save = async (_, { subCategoryData = {} }) => {
  try {
    const { _id } = subCategoryData;
    if (_id) {
      return await SubCategory_update(_, { subCategoryData });
    } else {
      return await SubCategory_register(_, { subCategoryData });
    }
  } catch (error) {
    return error;
  }
};
const SubCategory_delete = async (_, { _id }) => {
  try {
    await SubCategory.findOneAndDelete({_id});
    return true;
  } catch (error) {
    return error;
  }
};

export const subCategoryResolvers = {
  Query: {
    SubCategories,
    subCategoriesTotal,
  },
  Mutation: {
    SubCategory_delete,
    SubCategory_save,
  },
};
