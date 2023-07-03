import Rol from "../../models/Rol.js";
import { v4 as uuidv4 } from "uuid";

const Rols = async () => await Rol.find();

const Rol_register = async (_, { rolData={} }) => {
  try {
    const {name} = rolData
    const rolFound = await Rol.find({ name });
    if (rolFound.length === 0) {
      const rol = new Rol({
        _id: uuidv4(),
        name,
      });
      await rol.save();
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return error;
  }
};
const Rol_update = async (_, { rolData = {} }) => {
  try {
    await Rol.findByIdAndUpdate(rolData._id, rolData, {
      new: true,
    });
    return true;
  } catch (error) {
    return error;
  }
};
const Rol_save = async (_, { rolData = {} }) => {
  try {
    const { _id } = rolData;
    if (_id) {
      return await Rol_update(_, { rolData });
    } else {
      return await Rol_register(_, { rolData });
    }
  } catch (error) {
    return error;
  }
};
const Rol_delete = async (_, { _id }) => {
  try {
    await Rol.findOneAndDelete({_id});
    return true;
  } catch (error) {
    return error;
  }
};

export const rolResolvers = {
  Query: {
    Rols,
  },
  Mutation: {
    Rol_delete,
    Rol_save,
  },
};
