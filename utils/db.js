const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/matrimonial", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("connected to mongodb...");
  })
  .catch(() => {
    console.log("Error connecting to mongodb...");
  });
