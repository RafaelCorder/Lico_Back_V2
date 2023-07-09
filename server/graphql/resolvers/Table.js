import Table from "../../models/Table.js";
import { v4 as uuidv4 } from "uuid";
import pkg from "@codecraftkit/utils";
const { handlePagination } = pkg;

const Tables = async (_, { filters = {}, options = {} }) => {
  try {
    const { skip, limit } = handlePagination(options);
    let query = {};
    const { _id, search } = filters;
    if (_id) {
      query._id =  _id ;
    }
    if (search) {
      const like = { $regex: search, $options: "i" };
      query.$or = [{ name: like }];
    }
    const tables = Table.aggregate([])
      .match(query)
      .lookup({
        from: "bills",
        let: { tableId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ["$tableId", "$$tableId"] }, { $eq: ["$isPaid", false] }]
              }
            }
          }
        ],
        as: "bills"
      })
      .addFields({
        nameLower: { $toLower: "$name" }, // Agregar campo con nombre en minúscula
      })
      .sort({ nameLower: 1 });
    if (skip) tables.skip(skip);
    if (limit) tables.limit(limit);
    return await tables;
  } catch (error) {
    return error;
  }
};
// const Tables = async () => await Table.find();

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
