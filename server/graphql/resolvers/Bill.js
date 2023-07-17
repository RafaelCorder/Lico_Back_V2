import Bill from "../../models/Bill.js";
import { v4 as uuidv4 } from "uuid";
import pkg from "@codecraftkit/utils";
import Product from "../../models/Product.js";
import { productResolvers } from "./Product.js";
const { handlePagination } = pkg;

const Bills = async (_, { filters = {}, options = {} }) => {
  try {
    const { skip, limit } = handlePagination(options);
    let query = { isPaid: false };
    const { _id, tableId } = filters;
    if (_id) {
      query_id = _id;
    }
    if (tableId) {
      query.tableId = tableId;
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
const Bill_register = async (_, { billData = {} }) => {
  try {
    const { tableId, total, products, paymentMethod } = billData;
    let productsFound = [];
    const similarProductsPromises = products.map(async (product) => {
      const productFound = await Product.findOne({ _id: product._id }).select('-image');
      productsFound.push(productFound);
      return productFound;
    });
    const similarProducts = await Promise.all(similarProductsPromises);
 

    for (let i = 0; i < similarProducts.length; i++) {
      similarProducts[i].amount =
        similarProducts[i].amount - products[i].amount;
      similarProducts[i].soldCount =
        similarProducts[i].soldCount + products[i].amount;
    }
    let productData = {};
    await Promise.all(similarProducts.map(async (product) => {
      productData = product;
      await productResolvers.Mutation.Product_save(_, { productData });
    }));

    const bill = new Bill({
      _id: uuidv4(),
      tableId,
      total,
      products,
      paymentMethod,
    });
    const newBill = await bill.save();
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

const Bill_save = async (_, { billData = {} }) => {
  try {
    const { _id } = billData;
    if (_id) {
      return await Bill_update(_, { billData });
    } else {
      return await Bill_register(_, { billData });
    }
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

export const billResolvers = {
  Query: {
    Bills,
    billsTotal,
  },
  Mutation: {
    Bill_delete,
    Bill_save,
  },
};
