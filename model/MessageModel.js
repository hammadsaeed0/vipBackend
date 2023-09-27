import mongoose from "mongoose";

const msgSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      // required: true,
    },
    sender: {
      type: String,
      required: true,
    },

    chatId: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    type: {
      type: String,
    },
    voiceMessage: {
      type: String,
      default: "",
    },
    deleteme: {
      type: Object,
      default: {
        user: String,
      },
    },
  },
  {
    timestamps: true,
  },
  {
    collection: "messages",
  }
);

export default mongoose.model("message", msgSchema);
