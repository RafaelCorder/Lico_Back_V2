import { gql } from "graphql-tag";
export const sizeType = gql`
input Property_data_size{
    _id:String
    name:String
    image: String
  }
  type Query {
    Sizes: [Size]
  }
  type Mutation {
    Size_save(sizeData:Property_data_size): Boolean
    Size_delete(_id: String!): Boolean
  }
  type Size {
    _id: String
    name:String
    image: String
  }
`;
