import { gql } from "graphql-tag";
export const billType = gql`

  input Products{
    name: String,
    _id:String
  }
  type Query {
    Bills(filters: Property_data, options: Options): [Category]
    billsTotal:Int
  }
  type Mutation {
    Bill_save(categoryData: Property_data): Boolean
    Bill_delete(_id: String!): Boolean
  }
  type Bill {
    _id: String
    name: String
    tableId:String
    total: Float
    products: [Products]
    isPaid: Boolean
    isRemove: Boolean
  }
`;
