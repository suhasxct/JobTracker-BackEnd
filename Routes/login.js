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

    const response = await UserModel.findOne({
      email,
    });
    if (!response) {
      return res.json({
        message: "User Doesnt exsist",
      });
    }

    const passwordMatch = bcrypt.compare(password, response.password);
    if (passwordMatch) {
      const token = jwt.sign(
        {
          id: response._id.toString(),
        },
        JWT_SECRET
      );
      res.json({
        Messsage: "Login Successfull",
        token: token,
      });
    } else {
      res.json({
        message: "Incorrect Password",
      });
    }
  } catch (e) {
    res.send({
      message: "server Error",
    });
  }
});

module.exports = router;
