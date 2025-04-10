const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const User = new Schema({
  email: {
    type: String,
    unique: true,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  firstname: {
    type: String,
    require: true,
  },
  lastname: {
    type: String,
    require: true,
  },
});

const JobApplication = new Schema({
  userId: { type: ObjectId, ref: "user" },
  Company: String,
  Role: String,
  status: String,
  DateOfApplication: Date,
  url: String,
});

const UserModel = mongoose.model("user", User);
const JobApplicationModel = mongoose.model("jobapplication", JobApplication);

module.exports = {
  UserModel,
  JobApplicationModel,
};
