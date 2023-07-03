import { gql } from "graphql-tag";
export const brandType = gql`
  input Property_data_brand{
    _id:String
    name:String
    image: Upload
  }
  type Query {
    Brands: [Brand]
  }
  type Mutation {
    Brand_save(brandData: Property_data_brand): Boolean
    Brand_delete(_id: String!): Boolean
  }
  type Subscription{
    subNewBrand:Brand
  }
  type Brand {
    _id: String
    name: String
    image: String
    products: [Product]
  }
`;
