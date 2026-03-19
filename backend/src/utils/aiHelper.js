import Conversation from "../models/Conversation.js";
import { AI_USER_ID } from "./seedAIUser.js";

export const extractAIPrompt = (content) => {
  if (!content) return null;

  const lower = content.toLowerCase();

  if (!lower.includes("@ai")) return null;

  // lấy phần sau @ai
  const prompt = content.split(/@ai/i)[1]?.trim();

  return prompt || null;
};
export const ConversationAi = async (_id) => {
  const existing = await Conversation.findOne({
    type: "direct",
    "participants.userId": { $all: [_id, AI_USER_ID] },
  });

  if (!existing) {
    await Conversation.create({
      type: "direct",
      participants: [{ userId: _id }, { userId: AI_USER_ID }],
      lastMessageAt: new Date(),
    });
  }
};
