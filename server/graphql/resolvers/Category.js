import Category from "../../models/Category.js";
import SubCategory from "../../models/SubCategory.js";
import { v4 as uuidv4 } from "uuid";
import pkg from "@codecraftkit/utils";
const { handlePagination } = pkg;

const Categories = async (_, { filters = {}, options = {} }) => {
  try {
    const { skip, limit } = handlePagination(options);
    let query = {};
    const { _id, search } = filters;
    if (_id) {
      query = { _id };
    }
    if (search) {
      const like = { $regex: search, $options: "i" };
      query = {
        $or: [
          { name: like },
        ],
      };
    }
    const categories = Category.aggregate([])
      .match(query)
      .lookup({
        from: "products",
        localField: "_id",
        foreignField: "categoryId",
        as: "products",
      })
      .lookup({
        from: "subcategories",
        localField: "_id",
        foreignField: "categoryId",
        as: "subCategories",
      })
      .addFields({
        nameLower: { $toLower: "$name" }, // Agregar campo con nombre en minúscula
      })
      .sort({ nameLower: 1 });
    if (skip) categories.skip(skip);
    if (limit) categories.limit(limit);
    return await categories;
  } catch (error) {
    return error;
  }
};
const categoriesTotal = async () => await Category.count();
const Category_register = async (_, { categoryData = {} }) => {
  try {
    const { name } = categoryData;
    const categoryFound = await Category.find({ name });
    if (categoryFound.length === 0) {
      const category = new Category({
        _id: uuidv4(),
        name,
      });
      await category.save();
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return error;
  }
};
const Category_update = async (_, { categoryData = {} }) => {
  try {
    await Category.findByIdAndUpdate(categoryData._id, categoryData, {
      new: true,
    });
    return true;
  } catch (error) {
    return error;
  }
};
const Category_save = async (_, { categoryData = {} }) => {
  try {
    const { _id } = categoryData;
    if (_id) {
      return await Category_update(_, { categoryData });
    } else {
      return await Category_register(_, { categoryData });
    }
  } catch (error) {
    return error;
  }
};
const Category_delete = async (_, { _id }) => {
  try {
    await Category.findOneAndDelete({ _id });
    await SubCategory.deleteMany({categoryId:_id})
    return true;
  } catch (error) {
    return error;
  }
};

export const categoryResolvers = {
  Query: {
    Categories,
    categoriesTotal,
  },
  Mutation: {
    Category_delete,
    Category_save,
  },
};
