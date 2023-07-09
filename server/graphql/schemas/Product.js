import { gql } from "graphql-tag";
export const productType = gql`
  scalar Upload
  input Product_filters {
    _id: String
    search: String
    categoryId: String
    subCategoryId: String
  }
  
  input Product_data {
    _id: String
    name: String
    price: Float
    isStay:Float
    isLeave:Float
    amount: Int
    iva: Float
    isRemove: Boolean
    categoryId: String
    subCategoryId: String
    image:Upload
    url:String
    soldCount: Int
    description: String
  }
  type Query {
    Products(filters: Product_filters, options: Options): [Product]
    productsTotal:Int
  }
  type Mutation {
    Product_save(productData: Product_data): String
    Product_delete(_id: String!): Boolean
  }
  type Subscription {
    subNewProduct: Product
  }
  type Product {
    _id: String
    name: String
    price: Float
    isStay:Float
    isLeave:Float
    amount: Int
    soldCount: Int
    iva: Float
    isRemove: Boolean
    categoryId: String
    subCategoryId: String
    createdAt: String
    updatedAt: String
    image: String
    url:String
    category: Category
    subCategory: SubCategory
    description: String
  }
`;
