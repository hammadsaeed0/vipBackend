import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    other: {
      type: String,
      required: true,
    },
    lastMessage: {},
    unread: {
      type: String,
      default: "0",
    },
    archive: {
      type: Boolean,
      default: false,
    },
    mute: {
      type: Boolean,
      default: false,
    },
    block: {
      type: Object,
      default: {
        blocked: String,
        blockedBy: String,
      },
    },
  },
  {
    collection: "chats",
  }
);

export default mongoose.model("chatSchema", chatSchema);
