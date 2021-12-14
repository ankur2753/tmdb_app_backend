const router = require("express").Router();
const sql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connection = require("../connectDB");
const { body, validationResult } = require("express-validator");

router.get(
  "/",
  [body("username").notEmpty(), body("password").notEmpty()],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      //   sanitize input
      let req_username = sql.escape(req.body.username);
      let req_password = sql.escape(req.body.password);
      // retrive salt and password from db and then check the password
      connection.query(
        "select P.PASSWORD,I.EMAIL_ID from ID_PASS P,USER_INFO I where P.USERNAME = ?",
        [req_username],
        (error, results, fields) => {
          if (error) {
            console.log(error);
            return res.status(404).json({ errors: error.sqlMessage });
          }
          if (results.length > 0) {
            console.log(results);
            if (!bcrypt.compareSync(req_password, results[0].PASSWORD)) {
              return res.status(403).json({ error: "invalid credentials" });
            } else return res.status(200).json({ success: "password matched" });
          }
          if (fields) console.log(fields);

          return res.send({ error: "user not found" });
        }
      );
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.message });
    }
  }
);

module.exports = router;
