import { gql } from "graphql-tag";
export const chatType = gql`
input filters_Chat{
  _id:ID
  participant:String
}
type Message {
    _id: ID
    sender: String
    content: String
    timestamp: String
  }

  type Chat {
    _id: ID!
    participants: [String]
    messages: [Message]
  }

  type Query {
    getChats(filters: filters_Chat): [Chat]
  }

  type Mutation {
    createChat(participants: [String]): Boolean
    addMessage(chatId: ID!, sender: String, content: String): Message
    Delete_chat(_id:String!):Boolean
  }
  type Subscription {
    messageAdded(chatId: ID): Message
  }
`;
