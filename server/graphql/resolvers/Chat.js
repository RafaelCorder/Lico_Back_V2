import Chat from "../../models/Chat.js";
import { withFilter } from "graphql-subscriptions";
import { pubsub } from "../schema.js";

const getChats = async (_, { filters = {} }) => {
  try {
    const { _id, participant } = filters;
    let query = {};
    if (_id) {
      const chat = await Chat.findById(_id);
      return chat;
    }
    if (participant) {
      query = { participants: participant }
    }
    const chat = await Chat.aggregate([])
    .match(query);
    return chat;
  } catch (error) {
    throw new Error("No se pudo obtener el chat");
  }
};

const createChat = async (_, { participants = [] }) => {
  try {
    //console.log(participants);
    let query = {participants: participants[1]}
    const chat = await Chat.aggregate([])
    .match(query);
    if (participants.length > 1 && chat.length === 0) {
      const chat = new Chat({ participants });
      await chat.save();
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error("No se pudo crear el chat");
  }
};
const addMessage = async (_, { chatId, sender, content }) => {
  try {
    const message = { sender, content, timestamp: new Date().toISOString() };
    await Chat.findByIdAndUpdate(chatId, { $push: { messages: message } });
    pubsub.publish("MESSAGE_ADDED", { messageAdded: message });
    return message;
  } catch (error) {
    throw new Error("No se pudo agregar el mensaje al chat");
  }
};
const Delete_chat = async (_,{_id})=>{
  try {
    if (_id) {
      await Chat.findByIdAndDelete(_id)
      return true
    }else{
      return false
    }
  } catch (error) {
    return error
  }
}
// const messageAdded = {
//   subscribe: withFilter(
//     () => pubsub.asyncIterator("MESSAGE_ADDED"),
//     async (payload, variables, { userId }) => {
//       const chatId = variables.chatId;
//       const chat = await Chat.findById(chatId);

//       // Verificar si el usuario actual es un participante del chat
//       const isParticipant = chat.participants.includes(userId);

//       // Solo enviar la notificación al usuario que es participante del chat
//       return isParticipant;
//     }
//   ),
// };
const messageAdded = {
  subscribe: (_, { chatId }) => {
    const message = pubsub.asyncIterator(`MESSAGE_ADDED`);
    return message;
  },
};

export const chatResolvers = {
  Query: {
    getChats,
  },
  Mutation: {
    createChat,
    addMessage,
    Delete_chat,
  },
  Subscription: {
    messageAdded,
  },
};
