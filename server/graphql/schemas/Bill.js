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
  }
  input Filters_bills {
    _id: String
    tableId: String
    type: String
  }
  type Query {
    Bills(filters: Filters_bills, options: Options): [Bill]
    billsTotal: Int
  }
  type Mutation {
    Bill_save(billData: Bill_data): String
    Bill_delete(_id: String!): Boolean
  }
  type Subscription {
    subNewBill: Bill
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
  }
`;
