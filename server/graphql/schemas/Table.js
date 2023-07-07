import { gql } from "graphql-tag";
export const tableType = gql`

  type Query {
    Tables: [Table]
  }
  type Mutation {
    Table_save(tableData:Property_data): Boolean
    Table_delete(_id: String!): Boolean
  }
  type Table {
    _id: String
    name:String
  }
`;
