import Bill from "../../models/Bill.js";
import { v4 as uuidv4 } from "uuid";
import pkg from "@codecraftkit/utils";
import Product from "../../models/Product.js";
import { productResolvers } from "./Product.js";
import { pubsub } from "../schema.js";
import { withFilter } from "graphql-subscriptions";
const { handlePagination } = pkg;

const Bills = async (_, { filters = {}, options = {} }) => {
  try {
    const { skip, limit } = handlePagination(options);
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
    const bills = Bill.aggregate([])
      .match(query)
      .lookup({
        from: "tables",
        localField: "tableId",
        foreignField: "_id",
        as: "table",
      })
      .unwind({ path: "$table", preserveNullAndEmptyArrays: true })
      .addFields({
        nameLower: { $toLower: "$name" }, // Agregar campo con nombre en minúscula
      })
      .sort({ nameLower: 1 });
    if (skip) bills.skip(skip);
    if (limit) bills.limit(limit);
    return await bills;
  } catch (error) {
    return error;
  }
};
const billsTotal = async () => await Bill.count();
const Bill_register = async (_, { billData = {} }, { session }) => {
  //console.log("hgola",billData);
  //console.log(session);
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
    similarProducts.map((product) => {});
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

    let products = [];

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
  //console.log(session, graphSettings);
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
// const subNewBill = {
//   subscribe: () => {
//     return pubsub.asyncIterator(["CREATE_BILL"]);
//   },
// };

const subNewBill = {
  subscribe: withFilter(
    () => pubsub.asyncIterator(["CREATE_BILL"]),
    (payload, variables, context) => {
      //console.log(context);
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
