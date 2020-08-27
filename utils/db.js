const mongoose = require("mongoose");

let DB;
if (process.env.NODE_ENV === "production") {
  DB = process.env.DATABASE;
} else {
  DB = process.env.DATABASE_LOCAL || "mongodb://localhost:27017/matrimonial";
}

mongoose
  .connect(
    "mongodb+srv://hbrehman:hbrehman@cluster0.vkxnh.mongodb.net/EliteMatch?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => {
    console.log("DB connection Successful");
  })
  .catch(() => {
    console.log("Problem connecting to mongodb...");
  });
