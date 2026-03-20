import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

export const initCallSocket = (io, socket, onlineUsers) => {
  socket.on("call-user", ({ to, offer, callType }) => {
    if (!to || !offer) return;

    const targetSocketId = onlineUsers.get(to?.toString?.() ?? String(to));

    if (!targetSocketId) {
      console.log("❌ call-user: target offline", {
        to,
        toString: to?.toString?.() ?? String(to),
        onlineKeys: Array.from(onlineUsers.keys()).slice(0, 20),
      });
      socket.emit("user-offline", { to });
      return;
    }

    console.log("📞 call-user:", {
      to,
      toString: to?.toString?.() ?? String(to),
      targetSocketId,
    });
    io.to(to?.toString?.() ?? String(to)).emit("incoming-call", {
      from: socket.user,
      offer,
      callType,
    });
  });

  socket.on("answer-call", ({ to, answer }) => {
    if (!to || !answer) return;

    const targetSocketId = onlineUsers.get(to?.toString?.() ?? String(to));
    if (!targetSocketId) {
      console.log("❌ answer-call: target offline", {
        to,
        onlineKeys: Array.from(onlineUsers.keys()).slice(0, 20),
      });
      return;
    }

    console.log("📨 answer-call:", {
      to: to?.toString?.() ?? String(to),
      targetSocketId,
    });
    io.to(to?.toString?.() ?? String(to)).emit("call-answered", { answer });
  });

  socket.on("ice-candidate", ({ to, candidate }) => {
    if (!to || !candidate) return;

    const targetSocketId = onlineUsers.get(to?.toString?.() ?? String(to));
    if (!targetSocketId) {
      // ICE đôi khi đến sau khi call kết thúc; chỉ log nhẹ
      return;
    }

    io.to(to?.toString?.() ?? String(to)).emit("ice-candidate", { candidate });
  });

  socket.on("end-call", async ({ to }) => {
    if (!to) return;
    // const senderId = socket.user._id;
    // const receiverId = to;

    try {
      // let conversation = await Conversation.findOne({
      //   type: "direct",
      //   "participants.userId": { $all: [senderId, receiverId] },
      // });

      // // 🆕 nếu chưa có thì tạo
      // if (!conversation) {
      //   conversation = await Conversation.create({
      //     type: "direct",
      //     participants: [{ userId: senderId }, { userId: receiverId }],
      //     lastMessageAt: new Date(),
      //   });
      // }

      // const message = await Message.create({
      //   conversationId: conversation._id,
      //   senderId,
      //   content:
      //     callType === "video"
      //       ? `📹 Cuộc hội thoại (${duration || 0}s)`
      //       : `📞 Cuộc gọi (${duration || 0}s)`,
      // });

      // updateConversationAfterCreateMessage(conversation, message, senderId);
      // await conversation.save();

      const targetSocketId = onlineUsers.get(to?.toString?.() ?? String(to));
      if (!targetSocketId) return;

      io.to(to?.toString?.() ?? String(to)).emit("call-ended");
      // emitNewMessage(io, conversation, message);
    } catch (err) {
      console.error("❌ end-call error:", err);
    }
  });
};
