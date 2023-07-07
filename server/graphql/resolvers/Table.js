import Table from "../../models/Table.js";
import { v4 as uuidv4 } from "uuid";

const Tables = async () => await Table.find();

const Table_register = async (_, { tableData={} }) => {
  try {
    const {name} = tableData
    const tableFound = await Table.find({ name });
    if (tableFound.length === 0) {
      const table = new Table({
        _id: uuidv4(),
        name,
      });
      await table.save();
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return error;
  }
};
const Table_update = async (_, { tableData = {} }) => {
  try {
    await Table.findByIdAndUpdate(tableData._id, tableData, {
      new: true,
    });
    return true;
  } catch (error) {
    return error;
  }
};
const Table_save = async (_, { tableData = {} }) => {
  try {
    const { _id } = tableData;
    if (_id) {
      return await Table_update(_, { tableData });
    } else {
      return await Table_register(_, { tableData });
    }
  } catch (error) {
    return error;
  }
};
const Table_delete = async (_, { _id }) => {
  try {
    await Table.findOneAndDelete({_id});
    return true;
  } catch (error) {
    return error;
  }
};

export const tableResolvers = {
  Query: {
    Tables,
  },
  Mutation: {
    Table_delete,
    Table_save,
  },
};
