import Size from "../../models/Size.js";
import { v4 as uuidv4 } from "uuid";

const Sizes = async () => await Size.find().sort({name:1});

const Size_register = async (_, { sizeData = {} }) => {
  try {
    const { name } = sizeData;
    const sizeFound = await Size.find({ name });
    if (sizeFound.length === 0) {
      const size = new Size({
        _id: uuidv4(),
        name,
      });
      await size.save();
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return error;
  }
};
const Size_update = async (_, { sizeData = {} }) => {
  try {
    await Size.findByIdAndUpdate(sizeData._id, sizeData, {
      new: true,
    });
    return true;
  } catch (error) {
    return error;
  }
};
const Size_save = async (_, { sizeData = {} }) => {
  try {
    const { _id } = sizeData;
    if (_id) {
      return await Size_update(_, { sizeData });
    } else {
      return await Size_register(_, { sizeData });
    }
  } catch (error) {
    return error;
  }
};
const Size_delete = async (_, { _id }) => {
  try {
    await Size.findOneAndDelete({ _id });
    return true;
  } catch (error) {
    return error;
  }
};

export const sizeResolvers = {
  Query: {
    Sizes,
  },
  Mutation: {
    Size_delete,
    Size_save,
  },
};
