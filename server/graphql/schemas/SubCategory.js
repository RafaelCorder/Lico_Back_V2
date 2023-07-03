import { gql } from "graphql-tag";
export const subCategoryType = gql`
  input Filters_subcategory{
    categoryId: String
  }
  input Property_data_subCategory{
    _id:String
    name: String
    image: String
    categoryId: String
  }
  type Query {
    SubCategories(filters:Filters_subcategory): [SubCategory]
  }
  
  type Mutation {
    SubCategory_save(subCategoryData: Property_data_subCategory): Boolean
    SubCategory_delete(_id: String!): Boolean
  }
  type SubCategory {
    _id: String
    name: String
    image:String
    products: [Product]
    categoryId: String
    category: Category
  }
`;
