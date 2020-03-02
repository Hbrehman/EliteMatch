const mongoose = require("mongoose");
const express = require("express");
const app = express();
mongoose
  .connect("mongodb://localhost:27017/test", {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to db");
  });

const userSchema = new mongoose.Schema({
  name: String,
  otherInfo: Object
});

const userModel = mongoose.model("user", userSchema);
async function createUser() {
  let user = await userModel.create({
    name: "hbrehman",
    otherInfo: {
      rollNum: 3
    }
  });
  console.log(user);
}

createUser();

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
