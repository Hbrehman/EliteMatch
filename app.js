require("./utils/db");
const auth = require("./controller/auth");
const user = require("./routes/userRoutes");
const cors = require("./utils/cors");
const dotenv = require("dotenv");
const express = require("express");
const app = express();

// Map data from config.env to environment variables
dotenv.config({ path: "./config.env" });

app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use(cors);

app.use("/v1/api/auth", auth);
app.use("/v1/api/users", user);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
