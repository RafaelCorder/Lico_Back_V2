import Providers from "../../models/Providers.js";
import { v4 as uuidv4 } from "uuid";
import pkg from "@codecraftkit/utils";
const { handlePagination } = pkg;

const providers = async (_, { filters = {}, options = {} }) => {
  try {
    const { skip, limit } = handlePagination(options);
    const { _id, search } = filters;
    let query = {};
    if (_id) {
      query = { _id };
    }
    if (search) {
      const like = { $regex: search, $options: "i" };
      query = {
        $or: [
          { name: like },
          { phone: like },
          { address: like },
          { email: like },
        ],
      };
    }
    const providers = Providers.aggregate([]).match(query);
    if (skip) providers.skip(skip);
    if (limit) providers.limit(limit);
    return await providers;
  } catch (error) {
    return error;
  }
};
const providersTotal = async () => await Providers.count();
const Provider_delete = async (_, { _id }) => {
  try {
    await Providers.findByIdAndDelete(_id);
    return true;
  } catch (error) {
    return error;
  }
};
const Provider_register = async (_, { providersData }) => {
  try {
    const { name, phone, address, email } = providersData;
    const ProviderFound = await Providers.find({ name });
    if (ProviderFound.length > 0) {
      return false;
    } else {
      const provider = new Providers({
        _id: uuidv4(),
        name,
        phone,
        address,
        email,
      });
      await provider.save();
      return true;
    }
  } catch (error) {
    return error;
  }
};
const Provider_update = async (_, { providersData = {} }) => {
  try {
    await Providers.findByIdAndUpdate(providersData._id, providersData, {
      new: true,
    });
    return true;
  } catch (error) {
    return error;
  }
};
const Provider_save = async (_, { providersData = {} }) => {
  try {
    const { _id } = providersData;
    if (_id) {
      return await Provider_update(_, { providersData });
    } else {
      return await Provider_register(_, { providersData });
    }
  } catch (error) {
    return error;
  }
};
export const providersResolvers = {
  Query: {
    providers,
    providersTotal,
  },
  Mutation: {
    Provider_delete,
    Provider_save,
  },
};
