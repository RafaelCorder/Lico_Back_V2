import Car from "../../models/Car.js";
import Product from "../../models/Product.js";
import { v4 as uuidv4 } from "uuid";

const Cars = async (_, { filters = {} }) => {
  try {
    const {_id, userId} = filters
    let query = {};
    if (_id) {
      query = {_id}
    }
    if (userId) {
      query = {userId}
    }
    const cars = await Car.aggregate([])
    .match(query)
    .lookup({
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user",
    })
    .unwind({ path: "$user", preserveNullAndEmptyArrays: true })
    .unwind("items")
    .lookup({
      from: "products",
      localField: "items.product",
      foreignField: "_id",
      as: "product"
    })
    .unwind("product")
    .group({
      _id: "$_id",
      userId: { $first: "$userId" },
      isPaid: { $first: "$isPaid" },
      createdAt: { $first: "$createdAt"},
      createdAt: { $first: "$updatedAt"},
      user: { $first: "$user" },
      items: { 
        $push: {
          product: "$product",
          quantity: "$items.quantity"
        }
      }
    })

    return cars;
  } catch (error) {
    return error;
  }
};

const Car_register = async (_, { carData = {} }) => {
  try {
    const { userId, productIds } = carData;
    const carItems = productIds.map((productId) => ({
      product: productId,
      quantity: 1,
    }));
    const car = new Car({
      _id: uuidv4(),
      userId,
      items: carItems,
    });
    await car.save();
    return true;
  } catch (error) {
    return error;
  }
};
const Car_delete = async (_, { _id }) => {
  try {
    await Category.findByIdAndDelete(_id);
    return true;
  } catch (error) {
    return error;
  }
};

export const carResolvers = {
  Query: {
    Cars,
  },
  Mutation: {
    Car_register,
    Car_delete,
  },
};
