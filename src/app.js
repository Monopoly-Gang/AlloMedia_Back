require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const routes = require("./routes/ClientRoutes");
const  seedRestaurant  = require("./utils/seedRestaurants");

const app = express();

seedRestaurant();

const corsOptions = {
    origin: process.env.FRONT_APP_HOST,
    credentials: true,
};

// middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("../public"));

// routes
app.use("/",routes);



module.exports = app;
