import { gql } from "graphql-tag";
export const carType = gql`
  input Car_filters{
    _id: String
    userId: String
  }
  input Car_data {
    userId: String
    quantity: Int
    productIds: [String]
  }
  type Query {
    Cars(filters: Car_filters): [Car]
  }
  type Mutation {
    Car_register(carData: Car_data): Boolean
    Car_delete(_id: String!): Boolean
  }
  type CarItem {
    product: Product
    quantity: Int
  }

  type Car {
    _id: String
    userId: String
    user: User
    items: [CarItem]
    createdAt: String
  }
`;
