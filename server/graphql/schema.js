import {userType} from './schemas/User.js'
import {userResolvers} from './resolvers/User.js'
import {rolType} from './schemas/Rol.js'
import {rolResolvers} from './resolvers/Rol.js'
import {sizeType} from './schemas/Size.js'
import {sizeResolvers} from './resolvers/Size.js'
import {genderType} from './schemas/Gender.js'
import {genderResolvers} from './resolvers/Gender.js'
import {categoryType} from './schemas/Category.js'
import {categoryResolvers} from './resolvers/Category.js'
import {subCategoryType} from './schemas/SubCategory.js'
import {subCategoryResolvers} from './resolvers/SubCategory.js'
import {productType} from './schemas/Product.js'
import {productResolvers} from './resolvers/Product.js'
import {brandType} from './schemas/Brand.js'
import {brandResolvers} from './resolvers/Brand.js'
import {carType} from './schemas/Car.js'
import {carResolvers} from './resolvers/Car.js'
import {chatType} from './schemas/Chat.js'
import {chatResolvers} from './resolvers/Chat.js'

import { PubSub } from "graphql-subscriptions";
export const pubsub = new PubSub();

export const resolvers = [
  userResolvers,
  rolResolvers,
  genderResolvers,
  categoryResolvers,
  productResolvers,
  brandResolvers,
  carResolvers,
  subCategoryResolvers,
  chatResolvers,
  sizeResolvers,
];

export const typeDefs = [
  userType,
  rolType,
  genderType,
  categoryType,
  productType,
  brandType,
  carType,
  subCategoryType,
  chatType,
  sizeType,
];
