const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { UserModel } = require("../DB");
const { z } = require("zod");
router.use(express.json());
router.post("/signup", function (req, res) {
  const userSchema = z.object({
    email: z.string().email({ message: "Invalid email format" }),
    password: z
      .string()
      .min(4, { message: "Password must be at least 8 characters long" }),
    firstname: z.string(),
    lastname: z.string(),
  });
  const valid = userSchema.safeParse(req.body);
  if (!valid.success) {
    res.status(403).json({
      message: valid.error,
    });
    return;
  }
  try {
    const email = req.body.email;
    const password = req.body.password;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;

    bcrypt.hash(password, 5, async function (err, hash) {
      if (err) {
        res.json({
          Error: "Hashing Error",
        });
      } else {
        try {
          await UserModel.create({
            email,
            password: hash,
            firstname,
            lastname,
          });
        } catch (e) {
          res.json({
            Error: "Email already Exsist",
          });
          return;
        }
      }
    });
    res.json({
      message: "Signedin Successfully",
    });
  } catch (e) {
    res.send({
      message: "Server Error",
    });
  }
});

module.exports = router;
