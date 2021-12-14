const express = require("express");
const signUp = require("./Routes/signUp");
const signIn = require("./Routes/signIn");
const app = express();

app.listen(3000, () => {
  console.log("listening on port 3000 ");
});

app.use(express.json());

app.use("/signUp", signUp);
app.use("/signIn", signIn);
