import User from "../models/User.js";

export const AI_USER_ID = "000000000000000000000001";

// export const AI_USER_ID = new mongoose.Types.ObjectId(
//   "000000000000000000000001"
// );

export const seedAIUser = async () => {
  try {
    const existing = await User.findById(AI_USER_ID);

    if (existing) {
      console.log("🤖 AI user đã tồn tại");
      return;
    }

    await User.create({
      _id: AI_USER_ID,
      email: "ai@chatify.com", 
      displayName: "Chatify AI", 
      avatarUrl: "https://i.imgur.com/ai-avatar.png",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("🤖 Đã tạo AI user thành công");
  } catch (error) {
    console.error("❌ Lỗi tạo AI user:", error);
  }
};
