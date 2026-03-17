import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema({
  url: String,
  type: {
    type: String,
    enum: ["image", "video", "file"],
  },
  filename: String,
  size: Number,
});

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      trim: true,
    },

    attachments: [attachmentSchema], // 👈 hỗ trợ nhiều file
  },
  {
    timestamps: true,
  },
);

messageSchema.index({ conversationId: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
