const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const userCollection = require("./Schemas/userSchema");
const app = express();
const cors = require('cors');
app.use(cors({
  origin : "http://localhost:5173",
  credentials : true,
}))
app.use(express.json());
app.use(cookieParser());
const authRoute = require("./Routes/userAuth");
const connectDB = require("./config/dbConnect");
const redisClient = require("./config/redis");
const problemRoute = require("./Routes/problem");
const submitRoute = require("./Routes/submit");
app.use((req, res, next) => {
  console.log("REQ:", req.method, req.url);
  next();
});

app.use("/submission", submitRoute);
app.use("/user", authRoute);
app.use("/problem", problemRoute);
async function initialiseConnection() {
  try {
    await Promise.all([connectDB(), redisClient.connect()]);
    console.log("Database and Redis activated!");
    app.listen(process.env.PORT, () => {
      console.log(`Listening at port number : ${process.env.PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}
initialiseConnection();
