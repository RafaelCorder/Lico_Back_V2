import { gql } from "graphql-tag";
export const tableType = gql`
  input Filters_table{
    _id:String
    search:String
  }
  type Query {
    Tables(filters: Filters_table, options: Options): [Table]
  }
  type Mutation {
    Table_save(tableData:Property_data): Boolean
    Table_delete(_id: String!): Boolean
  }
  type Table {
    _id: String
    name:String
    bills:[Bill]
    isStay:Boolean
  }
`;
