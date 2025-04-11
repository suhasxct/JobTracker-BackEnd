const middleware = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const { JobApplicationModel } = require("../DB");

router.get("/", middleware, async function (req, res) {
  function offer(response) {
    const resp = response.filter((obj) => {
      return obj.status.toLowerCase() === "offered";
    });
    if (resp.length == 0) {
      res.send({
        message: "NO DATA FOUND",
      });
    } else {
      res.send(resp);
    }
  }
  function apply(response) {
    const resp = response.filter((obj) => {
      return obj.status.toLowerCase() === "applied";
    });
    if (resp.length == 0) {
      res.send({
        message: "NO DATA FOUND",
      });
    } else {
      res.send(resp);
    }
  }
  function recent(response) {
    response.sort((a, b) => {
      const dateA = new Date(a.DateOfApplication);
      const dateB = new Date(b.DateOfApplication);
      return dateB - dateA;
    });
  }

  function reject(response) {
    const resp = response.filter((obj) => {
      return obj.status.toLowerCase() === "rejected";
    });
    if (resp.length == 0) {
      res.send({
        message: "NO DATA FOUND",
      });
    } else {
      res.send(resp);
    }
  }
  try {
    let response = await JobApplicationModel.find({
      userId: req.userId,
    });
    if (req.headers.type === "recent") {
      recent(response);
      res.send(response);
    } else if (req.headers.type.toLowerCase() === "reject") {
      reject(response);
    } else if (req.headers.type.toLowerCase() === "apply") {
      apply(response);
    } else if (req.headers.type.toLowerCase() === "offer") {
      offer(response);
    } else {
      res.send(response);
    }
  } catch (e) {
    console.log(e);
    res.json({
      message: "Something Went Wrong",
    });
  }
});

router.post("/addJob", middleware, async function (req, res) {
  try {
    const userId = req.userId;
    const Company = req.body.Company;
    const Role = req.body.Role;
    const status = req.body.status;
    const DateOfApplication = new Date();
    const url = req.body.url;
    await JobApplicationModel.create({
      userId,
      Company,
      Role,
      status,
      DateOfApplication,
      url,
    });
    res.json({
      message: "Job Added Succesfully",
    });
  } catch (e) {
    res.send({
      Message: "Server Error",
    });
  }
});

router.post("/updateJob", middleware, async function (req, res) {
  try {
    const updateFields = {};

    if (req.body.Company?.trim()) {
      updateFields.Company = req.body.Company;
    }
    if (req.body.Role?.trim()) {
      updateFields.Role = req.body.Role;
    }
    if (req.body.status?.trim()) {
      updateFields.status = req.body.status;
    }
    if (req.body.url?.trim()) {
      updateFields.url = req.body.url;
    }

    await JobApplicationModel.findByIdAndUpdate(req.headers.id, updateFields);

    res.json({
      message: "Job updated successfully",
    });
  } catch (e) {
    console.error("Update Error:", e);
    res.status(500).send({ message: "Server Error" });
  }
});

router.post("/delJob", middleware, async function (req, res) {
  try {
    await JobApplicationModel.findByIdAndDelete(req.headers.id);
    res.json({
      message: "Deleted Job Successfully",
    });
  } catch (e) {
    res.send({
      message: "Server Error",
    });
  }
});
module.exports = router;
