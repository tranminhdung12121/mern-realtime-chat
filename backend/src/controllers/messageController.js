import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import {
  emitNewMessage,
  updateConversationAfterCreateMessage,
} from "../utils/messageHelper.js";

import { io } from "../socket/index.js";
import { uploadFileFromBuffer } from "../middlewares/uploadMiddleware.js";
import { extractAIPrompt } from "../utils/aiHelper.js";
import { generateAIResponse } from "../utils/aiService.js";
import { AI_USER_ID } from "../utils/seedAIUser.js";

export const sendDirectMessage = async (req, res) => {
  try {
    const { recipientId, content, conversationId } = req.body;
    const senderId = req.user._id;
    const files = req.files || [];

    if (!content && files.length === 0) {
      return res.status(400).json({ message: "Tin nhắn rỗng" });
    }

    let conversation;

    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
    }

    if (!conversation) {
      conversation = await Conversation.create({
        type: "direct",
        participants: [
          { userId: senderId, joinedAt: new Date() },
          { userId: recipientId, joinedAt: new Date() },
        ],
        lastMessageAt: new Date(),
        unreadCounts: new Map(),
      });
    }

    const attachments = [];

    for (const file of files) {
      const result = await uploadFileFromBuffer(file.buffer);

      let type = "file";

      if (file.mimetype.startsWith("image")) type = "image";
      if (file.mimetype.startsWith("video")) type = "video";

      attachments.push({
        url: result.secure_url,
        type,
        filename: file.originalname,
        size: file.size,
      });
    }

    const message = await Message.create({
      conversationId: conversation._id,
      senderId,
      content,
      attachments,
    });

    updateConversationAfterCreateMessage(conversation, message, senderId);

    await conversation.save();

    emitNewMessage(io, conversation, message);

    // ===== 🤖 HANDLE AI =====
    const aiPrompt = extractAIPrompt(content);

    // ưu tiên @ai
    if (aiPrompt) {
      const aiReply = await generateAIResponse(aiPrompt);

      const aiMessage = await Message.create({
        conversationId: conversation._id,
        senderId: AI_USER_ID,
        content: aiReply,
      });

      updateConversationAfterCreateMessage(conversation, aiMessage, AI_USER_ID);
      await conversation.save();

      emitNewMessage(io, conversation, aiMessage);
    }
    // nếu không có @ai thì mới xử lý chat AI riêng
    else if (recipientId === AI_USER_ID) {
      const aiReply = await generateAIResponse(content);

      const aiMessage = await Message.create({
        conversationId: conversation._id,
        senderId: AI_USER_ID,
        content: aiReply,
      });

      updateConversationAfterCreateMessage(conversation, aiMessage, AI_USER_ID);
      await conversation.save();

      emitNewMessage(io, conversation, aiMessage);
    }

    return res.status(201).json({ message });
  } catch (error) {
    console.error("sendDirectMessage error:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;
    const senderId = req.user._id;
    const conversation = req.conversation;
    const files = req.files || [];

    if (!content && files.length === 0) {
      return res.status(400).json({ message: "Tin nhắn rỗng" });
    }

    const attachments = [];

    for (const file of files) {
      const result = await uploadFileFromBuffer(file.buffer);

      let type = "file";

      if (file.mimetype.startsWith("image")) type = "image";
      if (file.mimetype.startsWith("video")) type = "video";

      attachments.push({
        url: result.secure_url,
        type,
        filename: file.originalname,
        size: file.size,
      });
    }

    const message = await Message.create({
      conversationId,
      senderId,
      content,
      attachments,
    });

    updateConversationAfterCreateMessage(conversation, message, senderId);

    await conversation.save();

    emitNewMessage(io, conversation, message);
    // 🤖 detect @ai
    const aiPrompt = extractAIPrompt(content);

    if (aiPrompt) {
      const aiReply = await generateAIResponse(aiPrompt);

      const aiMessage = await Message.create({
        conversationId,
        senderId: AI_USER_ID,
        content: aiReply,
      });

      updateConversationAfterCreateMessage(conversation, aiMessage, AI_USER_ID);
      await conversation.save();

      emitNewMessage(io, conversation, aiMessage);
    }

    return res.status(201).json({ message });
  } catch (error) {
    console.error("sendGroupMessage error:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { _id } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(_id);

    if (!message) {
      return res.status(404).json({
        message: "Tin nhắn không tồn tại",
      });
    }

    // chỉ cho phép người gửi xóa
    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Bạn không có quyền xóa tin nhắn này",
      });
    }

    const conversationId = message.conversationId;

    await Message.findByIdAndDelete(_id);

    // tìm last message mới
    const lastMessage = await Message.findOne({ conversationId }).sort({
      createdAt: -1,
    });

    if (lastMessage) {
      await Conversation.updateOne(
        { _id: conversationId },
        {
          lastMessage: {
            _id: lastMessage._id,
            content: lastMessage.content,
            senderId: lastMessage.senderId,
            createdAt: lastMessage.createdAt,
          },
          lastMessageAt: lastMessage.createdAt,
        },
      );
    } else {
      await Conversation.updateOne(
        { _id: conversationId },
        {
          lastMessage: null,
          lastMessageAt: null,
        },
      );
    }

    // realtime
    io.to(conversationId.toString()).emit("messageDeleted", {
      _id,
      conversationId,
      lastMessage,
    });

    return res.status(200).json({
      messageId: _id,
      conversationId,
      lastMessage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Lỗi khi xóa tin nhắn",
    });
  }
};
