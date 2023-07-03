import { gql } from "graphql-tag";
export const productType = gql`
  scalar Upload
  input Product_filters {
    _id: String
    search: String
    genderId: String
    categoryId: String
    subCategoryId: String
    brandId: String
    child: Boolean
  }
  input Size_input {
    name: String
    available: Boolean
    stock: Int
  }
  input Product_data {
    _id: String
    name: String
    price: Float
    amount: Int
    iva: Float
    isRemove: Boolean
    genderId: String
    categoryId: String
    subCategoryId: String
    brandId: String
    child: Boolean
    image: Upload
    soldCount: Int
    size: [Size_input]
    description: String
  }
  type Query {
    Products(filters: Product_filters, options: Options): [Product]
  }
  type Mutation {
    Product_save(productData: Product_data): String
    Product_delete(_id: String!): Boolean
  }
  type Subscription {
    subNewProduct: Product
  }
  type Size {
    name: String
    available: Boolean
    stock: Int
  }
  type Product {
    _id: String
    name: String
    price: Float
    amount: Int
    soldCount: Int
    iva: Float
    isRemove: Boolean
    genderId: String
    categoryId: String
    subCategoryId: String
    brandId: String
    child: Boolean
    createdAt: String
    updatedAt: String
    image: String
    gender: Gender
    category: Category
    subCategory: SubCategory
    brand: Brand
    size: [Size]
    description: String
  }
`;
