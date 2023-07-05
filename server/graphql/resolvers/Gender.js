import Gender from "../../models/Gender.js";
import { v4 as uuidv4 } from "uuid";

const Genders = async (_,{filters={}}) => {
  try {
    const {_id} = filters;
    let query = {};
    if (_id) {
      query = { _id }
    }
    const genders = await Gender.aggregate([])
    .match(query)
    
    return genders;
  } catch (error) {
    return error;
  }
};

const Gender_register = async (_, { genderData = {} }) => {
  try {
    const { name } = genderData;
    const genderFound = await Gender.find({ name });

    if (genderFound.length === 0) {
      const gender = new Gender({
        _id: uuidv4(),
        name,
      });
      await gender.save();
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return error;
  }
};
const Gender_update = async (_, { genderData = {} }) => {
  try {
    await Gender.findByIdAndUpdate(genderData._id, genderData, {
      new: true,
    });
    return true;
  } catch (error) {
    return error;
  }
};
const Gender_save = async (_, { genderData = {} }) => {
  try {
    const { _id } = genderData;
    if (_id) {
      return await Gender_update(_, { genderData });
    } else {
      return await Gender_register(_, { genderData });
    }
  } catch (error) {
    return error;
  }
};
const Gender_delete = async (_, { _id }) => {
  try {
    await Gender.findByIdAndDelete(_id);
    return true;
  } catch (error) {
    return error;
  }
};

export const genderResolvers = {
  Query: {
    Genders,
  },
  Mutation: {
    Gender_delete,
    Gender_save,
  },
};
