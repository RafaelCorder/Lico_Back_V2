import {userType} from './schemas/User.js'
import {userResolvers} from './resolvers/User.js'
import {rolType} from './schemas/Rol.js'
import {rolResolvers} from './resolvers/Rol.js'
import {providersType} from './schemas/Providers.js'
import {providersResolvers} from './resolvers/Providers.js'
import {genderType} from './schemas/Gender.js'
import {genderResolvers} from './resolvers/Gender.js'
import {categoryType} from './schemas/Category.js'
import {categoryResolvers} from './resolvers/Category.js'
import {subCategoryType} from './schemas/SubCategory.js'
import {subCategoryResolvers} from './resolvers/SubCategory.js'
import {productType} from './schemas/Product.js'
import {productResolvers} from './resolvers/Product.js'
import {companyType} from './schemas/Company.js'
import {companyResolvers} from './resolvers/Company.js'


import { PubSub } from "graphql-subscriptions";
export const pubsub = new PubSub();

export const resolvers = [
  userResolvers,
  rolResolvers,
  genderResolvers,
  categoryResolvers,
  productResolvers,
  subCategoryResolvers,
  companyResolvers,
  providersResolvers
];

export const typeDefs = [
  userType,
  rolType,
  genderType,
  categoryType,
  productType,
  subCategoryType,
  companyType,
  providersType,
];
