const mongoose = require("mongoose");

let DB;
if (process.env.NODE_ENV === "production") {
  DB = process.env.DATABASE;
} else {
  DB = process.env.DATABASE_LOCAL || "mongodb://localhost:27017/matrimonial";
}

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("DB connection Successful");
  })
  .catch(() => {
    console.log("Problem connecting to mongodb...");
  });
