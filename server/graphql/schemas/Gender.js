import { gql } from "graphql-tag";
export const genderType = gql`
  input Gender_filters{
    _id:String,
    search: String
  }
  type Query {
    Genders(filters: Gender_filters): [Gender]
  }
  type Mutation {
    Gender_save(genderData: Property_data): Boolean
    Gender_delete(_id: ID!): Boolean
  }
  type Gender {
    _id: String
    name: String
    image: String
    products: [Product]
  }
`;
