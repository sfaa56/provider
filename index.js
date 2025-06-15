// index.js
const express = require("express");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;
const cookieParser = require("cookie-parser");
const cors = require('cors');




connectDb();

app.use(cors({
  origin: "*", // frontend
  credentials: true,
}));

app.use(cookieParser());

app.use(express.json());



app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/user"));

app.use("/", (req, res) => {
  res.send("API is working ✅");
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


