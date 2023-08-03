import Bill from "../../models/Bill.js";
import { v4 as uuidv4 } from "uuid";
import pkg from "@codecraftkit/utils";
import Product from "../../models/Product.js";
import { productResolvers } from "./Product.js";
import { pubsub } from "../schema.js";
import { withFilter } from "graphql-subscriptions";
const { handlePagination } = pkg;
//QUERIES
const Bills = async (_, { filters = [], options = {}, filters_Date = {} }) => {
  try {
    const { skip, limit } = handlePagination(options);
    let query = {};
    const fieldTypes = {
      "dateInfo.day": "int",
      "dateInfo.month": "int",
      "dateInfo.year": "int",
      "dateInfo.weekNumber": "int",
    };
    filters.forEach((filter) => {
      const { key, value } = filter;
      if (fieldTypes[key] === "int") {
        query[key] = parseInt(value);
      } else {
        query[key] = value;
      }
    });
    const startDate = new Date(filters_Date.start)
    const endDate = new Date(filters_Date.end)
    endDate.setDate(endDate.getDate() + 1 )
    if (filters_Date.start && !filters_Date.end) {
      query = {...query, "dateInfo.datetime": { $gte: startDate } };
    }
    if (!filters_Date.start && filters_Date.end) {
      query = {...query, "dateInfo.datetime": { $lte: new Date(endDate.toISOString()) } };
    }
    if (filters_Date.start && filters_Date.end) {
      query = {...query,
        "dateInfo.datetime": {
          $gte: startDate,
          $lte: new Date(endDate.toISOString()),
        },
      };
    }
   
    const bills = Bill.aggregate([])
      .match(query)
      .lookup({
        from: "tables",
        localField: "tableId",
        foreignField: "_id",
        as: "table",
      })
      .unwind({ path: "$table", preserveNullAndEmptyArrays: true })
      .sort({ createdAt: -1 });
    if (skip) bills.skip(skip);
    if (limit) bills.limit(limit);

    return await bills;
  } catch (error) {
    return error;
  }
};
const billsTotal = async (_, { filters = [] }) => {
  let query = { isPaid: true };
  const fieldTypes = {
    "dateInfo.day": "int",
    "dateInfo.month": "int",
    "dateInfo.year": "int",
  };
  filters.forEach((filter) => {
    const { key, value } = filter;
    if (fieldTypes[key] === "int") {
      query[key] = parseInt(value);
    } else {
      query[key] = value;
    }
  });

  return await Bill.count(query);
};

//MUTATIONS
const Bill_register = async (_, { billData = {} }, { session }) => {
  try {
    const {
      tableId,
      total,
      products,
      paymentMethod,
      type,
      providerId,
      seller,
      company,
      dateInfo,
    } = billData;
    let productsFound = [];
    const similarProductsPromises = products.map(async (product) => {
      const productFound = await Product.findOne({ _id: product._id }).select(
        "-image"
      );
      productsFound.push(productFound);
      return productFound;
    });
    const similarProducts = await Promise.all(similarProductsPromises);
    // const similarProducts = products.filter(
    //   async (product) =>
    //     await Product.findOne({ _id: product._id }).select("-image")
    // );

    for (let i = 0; i < similarProducts.length; i++) {
      if (similarProducts[i].amount > 0 || type === "Compra") {
        similarProducts[i].amount =
          type !== "Compra"
            ? similarProducts[i].amount - products[i].amount
            : similarProducts[i].amount + products[i].amount;
        if (!type) {
          similarProducts[i].soldCount =
            similarProducts[i].soldCount + products[i].amount;
        }
      }
    }
    let productData = {};
    await Promise.all(
      similarProducts.map(async (product) => {
        productData = product;
        await productResolvers.Mutation.Product_save(_, { productData });
      })
    );

    const bill = new Bill({
      _id: uuidv4(),
      tableId,
      total,
      products,
      paymentMethod,
      type,
      providerId,
      seller,
      company,
      dateInfo,
    });

    const newBill = await bill.save();

    pubsub.publish("CREATE_BILL", {
      subNewBill: newBill,
    });

    return newBill._id;
  } catch (error) {
    return error;
  }
};
const Bill_update = async (_, { billData = {} }) => {
  try {
    const { _id, productId, amount } = billData;
    const existingBill = await Bill.findOne({ _id });

    if (!existingBill) {
      throw new Error("Bill not found");
    }
    const existingProducts = existingBill.products.slice(); // Crear una copia del array existingBill.products

   

    const newProduct = await Product.findOne({ _id: productId });
    newProduct.amount = await amount;
    const newProducts = existingProducts.filter((existingProduct) => {
      if (existingProduct._id === newProduct._id) {
        return (existingProduct.amount += newProduct.amount);
      } else {
        return existingProduct;
      }
    });
    if (
      !newProducts.some(
        (existingProduct) => existingProduct._id === newProduct._id
      )
    ) {
      newProducts.push(newProduct);
    }

    await Bill.findByIdAndUpdate(_id, { products: newProducts }, { new: true });

    return true;
  } catch (error) {
    return error;
  }
};
const Bill_save = async (_, { billData = {} }, ctx, graphSettings) => {
  const { session } = ctx;
  try {
    const { _id } = billData;
    const options = {
      create: Bill_register,
      update: Bill_update,
    };
    const option = _id ? "update" : "create";
    return await options[option](_, { billData }, ctx);
  } catch (error) {
    return error;
  }
};
const Bill_delete = async (_, { _id }) => {
  try {
    await Bill.findOneAndDelete({ _id });
    return true;
  } catch (error) {
    return error;
  }
};

//------------------- SUBSCRIPTIONS ----------------
// const subNewBill = {
//   subscribe: () => {
//     return pubsub.asyncIterator(["CREATE_BILL"]);
//   },
// };
const subNewBill = {
  subscribe: withFilter(
    () => pubsub.asyncIterator(["CREATE_BILL"]),
    (payload, variables, context) => {
      return true;
    }
  ),
};

export const billResolvers = {
  Query: {
    Bills,
    billsTotal,
  },
  Mutation: {
    Bill_delete,
    Bill_save,
  },
  Subscription: {
    subNewBill,
  },
};
