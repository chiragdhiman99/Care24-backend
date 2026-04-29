const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const app = express();
const passport = require("passport");
require("./src/config/passport");
const cookie = require("cookie-parser");
const connectDB = require("./src/config/db");
const paymentRoutes = require("./src/config/payment");
const bookingRoutes = require("./src/routes/bookingroutes");
const conversationRoutes = require("./src/routes/conversationRoutes");
const messageRoutes = require("./src/routes/messageRoutes");
const ChatbotRoutes = require("./src/routes/ChatbotRoutes");
const healthRoutes = require("./src/routes/healthRoutes");
const VitalsRoutes = require("./src/routes/VitalsRoutes");
const UserQueriesRoutes = require("./src/routes/UserQueriesRoutes");
const ReviewsRoutes = require("./src/routes/ReviewsRoutes");
const startCron = require("./src/utils/cronjob");
const { initSocket } = require("./src/utils/socket");
const http = require("http");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

connectDB();
const authRoutes = require("./src/routes/authroutes");
const caregiverRoutes = require("./src/routes/caregiverRoutes");
const NotificationsRoutes = require("./src/routes/NotificationsRoutes");

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://care24-frontend-tjrg.vercel.app",
    ],
    credentials: true,
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use(limiter);

app.use(express.json());
app.use(compression());
app.use(passport.initialize());
app.use(cookie());
app.use("/api/auth", authRoutes);
app.use("/api/caregivers", caregiverRoutes);
app.use("/api/notifications", NotificationsRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chatbot", ChatbotRoutes);
app.use("/api/health-records", healthRoutes);
app.use("/api/vitals", VitalsRoutes);
app.use("/api/user-queries", UserQueriesRoutes);
app.use("/api/reviews", ReviewsRoutes);
app.use("/images", express.static(__dirname + "/images"));
app.use("/uploads", express.static(__dirname + "/uploads"));
const PORT = process.env.PORT || 5001;

const server = http.createServer(app);
const io = initSocket(server);
app.set("io", io);
server.listen(PORT, () => {
  startCron();
});
