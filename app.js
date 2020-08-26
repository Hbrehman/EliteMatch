require("./utils/db");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errorController");
const auth = require("./controller/authController");
const user = require("./routes/userRoutes");
const cors = require("./utils/cors");
const dotenv = require("dotenv");
const express = require("express");
const path = require("path");

const app = express();

// Map data from config.env to environment variables
dotenv.config({ path: "./config.env" });
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
// Handling unhandled exceptions
process.on("uncaughtException", (ex) => {
  console.log(ex);
  process.exit(1);
});

// Body parser
app.use(express.json());

app.use(express.static("client/dist"));
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
});

// Middleware to serve static content
app.use(express.static(`${__dirname}/public`));

// middleware to handle Cross Origin Resourse Sharing issues
app.use(cors);

app.use("/v1/api/users", user);

// Handling unhandled rejections
process.on("unhandledRejection", (ex) => {
  console.log(ex);
  process.exit(1);
});

// Global Error Handler
app.use(globalErrorHandler);

// unexpected routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
