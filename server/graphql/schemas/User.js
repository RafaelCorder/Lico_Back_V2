import { gql } from "graphql-tag";
export const userType = gql`
scalar Date
scalar JSONObject
  input Options {
    page: Int
    limit: Int
    multi: Boolean
    sort: JSONObject
    forSelect: Boolean
  }
  input User_filters {
    _id: String
    rolId: String
    genderId: String
    search: String
  }
  input User_login {
    email: String
    password: String
  }
  input User_data {
    _id: String
    fullName: String
    nit: String
    phone: String
    address: String
    email: String
    password: String
    confirmPassword: String
    rolId: String
    genderId: String
    isRemove: Boolean
  }
  type Query {
    Users(filters: User_filters, options: Options): [User]
    User_login(userLogin: User_login): String
  }
  type Mutation {
    User_save(userData: User_data): Boolean
    User_delete(_id: String!): Boolean
  }
  type User {
    _id: String
    fullName: String
    nit: String
    phone: String
    email: String
    address: String
    password: String
    avatar: String
    isRemove:Boolean
    createdAt:String
    updatedAt: String
    genderId: String
    rolId: String
    rol: Rol
    gender:Gender
    cars: [Car]
  }
`;
