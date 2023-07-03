import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required:true
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatSchema = new mongoose.Schema({
  participants: [{
    type: String,
    required:true
  }],
  messages: [messageSchema],
});

export default mongoose.model('Chat', chatSchema);

