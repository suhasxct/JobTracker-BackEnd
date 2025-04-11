const bcrypt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const { UserModel } = require("../DB");
const router = express.Router();

router.post("/login", async function (req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const response = await UserModel.findOne({ email });
    if (!response) {
      return res.json({ message: "User Doesn't Exist" });
    }

    const passwordMatch = await bcrypt.compare(password, response.password);
    if (passwordMatch) {
      const token = jwt.sign(
        { id: response._id.toString() },
        JWT_SECRET
      );
      return res.json({
        message: "Login Successful",
        token: token,
      });
    } else {
      return res.json({ message: "Incorrect Password" });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
