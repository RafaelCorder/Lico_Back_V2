import { gql } from "graphql-tag";
export const rolType = gql`

  input Property_data{
    _id:String
    name:String
    image: String
  }
  type Query {
    Rols: [Rol]
  }
  type Mutation {
    Rol_save(rolData:Property_data): Boolean
    Rol_delete(_id: String!): Boolean
  }
  type Rol {
    _id: String
    name:String
  }
`;
