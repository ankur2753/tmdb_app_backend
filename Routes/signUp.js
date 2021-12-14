const router = require("express").Router();
const sql = require("mysql");
const bcrypt = require("bcryptjs");
const connection = require("../connectDB");
const { body, validationResult } = require("express-validator");

router.post(
  "/",
  [body("username").notEmpty(), body("password").notEmpty().isAlphanumeric()],
  (req, res) => {
    try {
      // check for input in request body
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      // sanitize input
      let username = sql.escape(req.body.username);
      let password = sql.escape(req.body.password);
      // hash password
      let hashed_pass = bcrypt.hashSync(password, bcrypt.genSaltSync());
      // insert into  the table
      connection.query(
        "insert into ID_PASS values (?,?)",
        [username, hashed_pass],
        (error, results) => {
          if (error) {
            console.error(error);
            res.statusCode = 400;
            res.send({ error: error.message });
          }
          if (results) {
            res.statusCode = 200;
            res.send({ success: "new user successfully created" });
          }
        }
      );
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.message });
    }
  }
);

router.post(
  "/createProfile",
  [
    body("email", "email is a required field and cannot be empty")
      .notEmpty()
      .isEmail(),
    body("username").notEmpty(),
    body("age").optional().isNumeric(),
    body("dob").optional().isDate(),
  ],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
      }
      console.log(req.body);
      return res.send(req.body);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);
module.exports = router;
