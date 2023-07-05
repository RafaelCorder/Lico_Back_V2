import { gql } from "graphql-tag";
export const companyType = gql`
  input Company_Data{
    _id: String
    name: String
    passwords: [String]
    address: String
    email:String
    image: String
    isRemove:Boolean
  }
  type Query {
    Companies(filters: Company_Data): [Company]
  }
  type Mutation {
    Company_save(companyData: Company_Data): Boolean
    Company_delete(_id: String!): Boolean
  }
  type Company {
    _id: String
    name: String
    passwords: [String]
    address: String
    email:String
    image: String
    isRemove:Boolean
  }
`;
