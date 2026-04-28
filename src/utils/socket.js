let io;
const Messages = require("../models/Messages");
const Conversation = require("../models/Conversation");
const Caregiver = require("../models/Caregiver");
const User = require("../models/User");
const onlineUsers = {};

const initSocket = (server) => {
  const { Server } = require("socket.io");
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {

    socket.on("joinRoom", (caregiverId) => {
      socket.join(caregiverId);
    });

    socket.on("joinUserRoom", (userId) => {
      socket.join(userId);
    });

    socket.on("getOnlineUsers", () => {
      socket.emit("onlineUsersList", onlineUsers);
    });

    socket.on("markseen", async (conversationId) => {
      await Messages.updateMany(
        { conversationId, isRead: false, senderType: "caregiver" },
        { isRead: true },
      );
      socket.to(conversationId).emit("messageseen");
    });

    socket.on("typing", (conversationId) => {
      socket.to(conversationId).emit("typing");
    });

    socket.on("stopTyping", (conversationId) => {
      socket.to(conversationId).emit("stopTyping");
    });

    socket.on("userOnline", (userId) => {
      onlineUsers[userId] = socket.id;
      io.emit("userStatus", { userId, online: true });
    });

    socket.on("joinconversation", async (conversationId) => {
      socket.join(conversationId);
      socket.emit("onlineUsersList", onlineUsers);
    });

    socket.on("sendmessage", async (data) => {
      const {
        conversationId,
        senderId,
        senderType,
        content,
        fileUrl,
        fileType,
      } = data;

      const newMessage = new Messages({
        conversationId,
        senderId,
        senderType,
        content,
        fileUrl,
        fileType,
      });
      await newMessage.save();

      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: content || "file",
        lastMessageTime: new Date(),
      });

      io.to(conversationId).emit("newmessage", newMessage);

      if (senderType === "caregiver") {
        const conversation = await Conversation.findById(conversationId);
        const user = await User.findById(conversation.userId);

        if (user?.notificationPreferences?.newMessages === true) {
          io.to(conversation.userId.toString()).emit("newMessageNotification", {
            message: `New message from your caregiver`,
            conversationId,
            createdAt: new Date(),
          });
        }
      }

      if (senderType === "user") {
        const conversation = await Conversation.findById(conversationId);
        const caregiver = await Caregiver.findById(conversation.caregiverId);
        const caregiverUser = await User.findOne({ email: caregiver.email });

        if (caregiverUser?.notificationPreferences?.newMessages === true) {
          io.to(conversation.caregiverId.toString()).emit(
            "newMessageNotification",
            {
              message: `New message from ${conversation.patientId}`,
              conversationId,
              createdAt: new Date(),
            },
          );
        }
      }
    });

    socket.on("disconnect", () => {
      const userId = Object.keys(onlineUsers).find(
        (key) => onlineUsers[key] === socket.id,
      );
      if (userId) {
        delete onlineUsers[userId];
        io.emit("userStatus", { userId, online: false });
      }
    });
  });
  return io;
};

const getIO = () => io;

module.exports = { initSocket, getIO };
