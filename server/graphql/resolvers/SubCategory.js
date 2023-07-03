import SubCategory from "../../models/SubCategory.js";
import { v4 as uuidv4 } from "uuid";

const SubCategories = async (_, { filters = {} }) => {
  try {
    const { categoryId } = filters;
    let query = {};
    if (categoryId) {
      query = { categoryId };
    }
    const subCategories = await SubCategory.aggregate([])
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

    return subCategories;
  } catch (error) {
    return error;
  }
};
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
    await SubCategory.findByIdAndUpdate(subCategoryData._id, subCategoryData, {
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
  },
  Mutation: {
    SubCategory_delete,
    SubCategory_save,
  },
};
