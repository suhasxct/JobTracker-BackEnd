const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const signup = require("./Routes/signup.js");
const login = require("./Routes/login.js");
const users = require("./Routes/user.js");
const cors = require("cors");
app.use(cors());
const allowedOrigins = [
  "https://jobtrackerfrontend-git-main-shashi-suhas-projects.vercel.app",
  "http://localhost:5173",
];
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

app.use("/user", users);
app.use("/user", signup);
app.use("/user", login);

try {
  mongoose.connect(MONGO_URI);
} catch (e) {
  res.json({
    Message: "Error in Connecting DataBase",
  });
}
app.listen(PORT, () => {
  console.log(`Server Running At port ${PORT}`);
});
