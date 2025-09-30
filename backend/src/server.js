import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import therapistRoutes from "./routes/therapistRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import { createServer } from "http";
import { Server } from "socket.io";
import Appointment from "./models/Appointment.js"; // Make sure this model exists
import Message from "./models/Message.js"; // Make sure this model exists
import phq9Routes from "./routes/phq9Routes.js";
import resourceRoutes from "./routes/resourceRoutes.js";

// Load env variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/therapists", therapistRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/phq9", phq9Routes);
app.use("/api/selfhelp", resourceRoutes);


// Test route
app.get("/", (req, res) => {
  res.send("MindConnect Backend is running ✅");
});

// MongoDB connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mindconnect";

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB Connected");

    // Wrap Express app with HTTP server
    const httpServer = createServer(app);

    // Initialize Socket.io
    const io = new Server(httpServer, {
      cors: {
        origin: "*", // For MVP, allow all origins
        methods: ["GET", "POST"],
      },
    });

    // Socket.io logic
    io.on("connection", (socket) => {
      console.log("⚡ User connected:", socket.id);

      // Automatically join rooms based on user appointments
      socket.on("joinAppointments", async (userId) => {
        try {
          const appointments = await Appointment.find({
            $or: [{ patient: userId }, { therapist: userId }]
          });

          appointments.forEach((appt) => {
            socket.join(appt._id.toString());
            console.log(`User ${userId} joined room ${appt._id}`);
          });

          // Notify the user which rooms they joined
          socket.emit("joinedRooms", appointments.map(a => a._id));
        } catch (err) {
          console.error("Error joining appointment rooms:", err.message);
        }
      });

      // Listen for chat messages
      socket.on("chatMessage", async ({ appointmentId, senderId, message }) => {
        try {
          // Save to DB
          const newMessage = await Message.create({
            appointment: appointmentId,
            sender: senderId,
            message,
          });

          // Populate sender for consistency
          const populated = await newMessage.populate("sender", "name role");

          // Emit message back to room with appointmentId included
          io.to(appointmentId).emit("message", {
            appointmentId,
            senderId: populated.sender._id,
            senderName: populated.sender.name,
            role: populated.sender.role,
            message: populated.message,
            timestamp: populated.createdAt,
          });
        } catch (err) {
          console.error("Error saving message:", err.message);
        }
      });


      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    // Start the HTTP server
    httpServer.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });
