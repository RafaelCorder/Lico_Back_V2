import User from "../../models/User.js";
import Rol from "../../models/Rol.js";
import { Avatars } from "../../config/avatar.js";
import { v4 as uuidv4 } from "uuid";
import pkg from "@codecraftkit/utils";
const { handlePagination } = pkg;
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

const randomIndex = Math.floor(Math.random() * Avatars.length);
const randomAvatar = Avatars[randomIndex];

const Users = async (_, { filters = {}, options = {} }, ctx) => {
  try {
    const { _id, rolId, genderId, search } = filters;
    const { skip, limit } = handlePagination(options);
    let query = { isRemove: false };
    if (_id) {
      query = { _id };
    }
    if (rolId) {
      query = { rolId };
    }
    if (genderId) {
      query = { genderId };
    }
    if (search) {
      const like = { $regex: search, $options: "i" };
      query = {
        $or: [
          { fullName: like },
          { nit: like },
          { telefono: like },
          { email: like },
        ],
      };
    }
    const users = User.aggregate([])
      .match(query)
      .lookup({
        from: "rols",
        localField: "rolId",
        foreignField: "_id",
        as: "rol",
      })
      .lookup({
        from: "genders",
        localField: "genderId",
        foreignField: "_id",
        as: "gender",
      })
      .lookup({
        from: "cars",
        localField: "_id",
        foreignField: "userId",
        as: "cars",
      })
      .unwind({ path: "$rol", preserveNullAndEmptyArrays: true })
      .unwind({ path: "$gender", preserveNullAndEmptyArrays: true })
      

    if (skip) users.skip(skip);
    if (limit) users.limit(limit);
    return await users;
  } catch (error) {
    return error;
  }
};
const User_login = async (_, { userLogin }, context) => {
  try {
    const { email, password } = userLogin;
    const OPTIONS = {
      expiresIn: '24h'
    };
    let query = { email }
    const user = await User.findOne(query);
    // const users = await User.aggregate([])
    // .match(query)
    // .lookup({
    //   from: "rols",
    //   localField: "rolId",
    //   foreignField: "_id",
    //   as: "rol",
    // })
    // .unwind({ path: "$rol", preserveNullAndEmptyArrays: true })
    // const user = users[0]
    if (user) {
      const storedPasswordHash = user.password;
      const handlePass = bcrypt.compareSync(password, storedPasswordHash);
      if (handlePass) {
        const payload = {
          ...user
        }
        const token = jwt.sign(payload, process.env.SECRET, OPTIONS)
        return token;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    return error;
  }
};
const User_register = async (_, { userData }) => {
  try {
    const { fullName, nit, phone, email, address, password, confirmPassword = "", genderId, rolId } = userData;
    const userFound = await User.find({ email });

    if (userFound.length === 0 && password === confirmPassword) {
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        _id: uuidv4(),
        fullName,
        nit,
        phone,
        email,
        address,
        password: hashedPassword,
        rolId,
        genderId,
        avatar: randomAvatar.url,
        background: "#FFF",
      });
      await user.save();
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return error;
  }
};
const User_update = async (_, { userData = {} }) => {
  try {
    await User.findByIdAndUpdate(userData._id, userData, {
      new: true,
    });
    return true;
  } catch (error) {
    return error;
  }
};
const User_save = async (_, { userData = {} }) => {
  try {
    const { _id } = userData;

    if (_id) {
      return await User_update(_, { userData });
    } else {
      return await User_register(_, { userData });
    }
  } catch (error) {
    return error;
  }
};
const User_delete = async (_, { _id }) => {
  try {
    await User.findByIdAndDelete(_id);
    return true;
  } catch (error) {
    return error;
  }
};
export const userResolvers = {
  Query: {
    Users,
    User_login,
  },
  Mutation: {
    User_delete,
    User_save,
  },
};
