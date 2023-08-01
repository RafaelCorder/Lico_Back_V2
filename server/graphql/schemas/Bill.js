import { gql } from "graphql-tag";
export const billType = gql`
  input Bill_data {
    _id: String
    tableId: String
    total: Float
    products: [Product_data]
    paymentMethod: String
    type: String
    providerId: String
    seller: User_data
    company: Company_Data
    dateInfo: inputDateInfo
  }
  input Filters_bills {
    key: String
    value: String
  }
  type Query {
    Bills(filters: [Filters_bills], options: Options): [Bill]
    billsTotal(filters:[Filters_bills]): Int
  }
  type Mutation {
    Bill_save(billData: Bill_data): String
    Bill_delete(_id: String!): Boolean
  }
  type Subscription {
    subNewBill(rol: String): Bill
  }
  type dateInfo {
    datetime: Date
    day: Int
    month: Int
    year: Int
    hours: Int
    minuts: Int
    seconds: Int
    dayName: String
    monthName: String
    weekNumber: Int
  }
  input inputDateInfo {
    datetime: Date
    day: Int
    month: Int
    year: Int
    hours: Int
    minuts: Int
    seconds: Int
    dayName: String
    monthName: String
    weekNumber: Int
  }
  type Bill {
    _id: String
    tableId: String
    total: Float
    products: [Product]
    table: Table
    isPaid: Boolean
    isRemove: Boolean
    paymentMethod: String
    type: String
    providerId: String
    seller: User
    company: Company
    createdAt: String
    dateInfo: dateInfo
  }
`;
