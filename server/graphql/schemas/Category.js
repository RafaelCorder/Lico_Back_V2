import { gql } from "graphql-tag";
export const categoryType = gql`

  type Query {
    Categories(filters: Property_data, options: Options): [Category]
    categoriesTotal:Int
  }
  type Mutation {
    Category_save(categoryData: Property_data): Boolean
    Category_delete(_id: String!): Boolean
  }
  type Category {
    _id: String
    name: String
    image:String
    subCategoryId: String
    products: [Product]
    subCategories: [SubCategory]
  }
`;
