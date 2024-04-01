const express = require("express");
const dotenv = require("dotenv").config();
const AppError = require("./utils/appError");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRouter");
const cardRouter = require("./routes/cardRouter");

const app = express();

app.use(cors());

app.use(cookieParser());
app.use(express.json());

// Router for user
app.use("/api/v1/user", userRouter);

// Router for card
app.use("/api/v1/card", cardRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
