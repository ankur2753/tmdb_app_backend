const router = require("express").Router();
const sql = require("mysql");
const bcrypt = require("bcryptjs");
const connection = require("../connectDB");
const { body, validationResult } = require("express-validator");
require("dotenv").config();

router.post(
  "/",
  [body("username").notEmpty(), body("password").notEmpty().isAlphanumeric()],
  (request, response) => {
    try {
      // check for input in request body
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
      }
      // sanitize input
      let username = sql.escape(request.body.username);
      let password = sql.escape(request.body.password);
      // hash password
      let hashed_pass = bcrypt.hashSync(password, bcrypt.genSaltSync());
      // insert into  the table
      connection.query(
        "insert into ID_PASS (USERNAME,PASSWORD) values (?,?);",
        [username, hashed_pass],
        (error, results) => {
          if (error) {
            console.error(error);
            response.statusCode = 400;
            response.send({ error: error.message });
          }
          if (results) {
            connection.query("SELECT LAST_INSERT_ID() as ID;", (err, res) => {
              if (err) response.status(500).json({ err });
              if (res)
                response.json({
                  success: "new user created successfully",
                  id: res[0].ID,
                });
            });
          }
        }
      );
    } catch (error) {
      console.error(error);
      response.status(500).send({ error: error.message });
    }
  }
);

router.post(
  "/createProfile",
  [
    body("user_id").isInt(),
    body("email").isEmail(),
    body("lang").isString(),
    body("adult").isBoolean(),
    body("country").isString(),
  ],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
      }

      // sanitize for sql
      // check what values are present in the request body
      let { user_id, email, lang, adult, country } = req.body;
      let query = "insert into USER_INFO  values (?,?,?,?,?)";
      // insert into user_info
      connection.query(
        query,
        [user_id, email, lang, adult, country],
        (error, results, fields) => {
          if (error) return res.status(500).json({ error });
          if (results) {
            console.log("new profile created for user_id:" + user_id);
            return res.json({
              success: "user profile created successfully",
              results,
            });
          }
          if (fields) console.log(fields);
        }
      );
      // return jwt token if success
      // return res.send(req.body);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);
module.exports = router;
