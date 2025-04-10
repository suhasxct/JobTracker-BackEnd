const jwt = require("jsonwebtoken");
const { UserModel } = require("../DB");
const JWT_SECRET = process.env.JWT_SECRET;
const mongoose = require("mongoose");
const { INVALID } = require("zod");
const ObjectId = mongoose.Types.ObjectId;

async function auth(req, res, next) {
  try {
    const token = req.headers.token;
    const decodedData = jwt.verify(token, JWT_SECRET);
    const userId = new ObjectId(decodedData.id);

    const response = await UserModel.findOne({
      _id: userId,
    });
    if (!response) {
      res.json({
        message: "Invalid Token",
      });
    } else {
      req.userId = response._id;
      next();
    }
  } catch (e) {
    res.send({
      Message: "Invalid Login",
    });
  }
}

module.exports = auth;
