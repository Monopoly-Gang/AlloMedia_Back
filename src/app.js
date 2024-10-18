require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const Router = require("./routes/index")

const app = express();

const corsOptions = {
    origin: process.env.FRONT_APP_HOST,
    credentials: true,
};

// middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("../public"));

app.use('/api', Router);


module.exports = app;
