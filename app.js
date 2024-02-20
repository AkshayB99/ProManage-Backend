const express = require("express");
const dotenv = require("dotenv").config();
const AppError = require("./utils/appError");

const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRouter");

const app = express();

app.use(express.json());

// Router
app.use("/api/v1/user", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
