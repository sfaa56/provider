const express = require("express");
const serverless = require("serverless-http");
const connectDb = require("../config/dbConnection");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
connectDb();

const app = express();

app.use(cors({
  origin: "*", // or your deployed frontend URL
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", require("../routes/auth"));
app.use("/api/users", require("../routes/user"));

app.get("/api", (req, res) => {
  res.send("API is working ✅");
});

// Export for Vercel
module.exports = app;
module.exports.handler = serverless(app);
