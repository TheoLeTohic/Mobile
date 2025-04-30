const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const userRoutes = require("../routes/UserRoutes");
const bikeRoutes = require("../routes/bikeRoutes");
const authRoutes = require("../routes/authRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/bikes", bikeRoutes);
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => res.send("Hello from Vercel!"));

// Connect to DB *only once when deployed*
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  isConnected = true;
  console.log("MongoDB connected");
}

module.exports = async (req, res) => {
  //await connectDB();
  return app(req, res);
};
