var express = require("express");
var sql = require("node:module");

const app = express();

app.listen(3000, () => {
  console.log("listening on port 3000 ");
});

app.get("/signUp", (req, res) => {
  let { username, password } = req.body;
  console.log(username, password);
  res.send("here");
});
