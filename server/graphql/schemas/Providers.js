import { gql } from 'graphql-tag'
export const providersType = gql`
input Providers_Filters{
  _id:String
  search: String
}
input Providers_Data{
  _id:String
  name: String
  phone: String
  address: String
  email: String
}
type Query{
  providers(filters: Providers_Filters, options: Options):[Providers]
  providersTotal:Int
}
type Mutation{
  Provider_save(providersData:Providers_Data):Boolean
  Provider_delete(_id:String!):Boolean
}
type Providers{
  _id:String
  name: String
  phone: String
  address: String
  salesManager: String
  email: String
}
`