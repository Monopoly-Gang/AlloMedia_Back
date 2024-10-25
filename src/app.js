require("dotenv").config();
const express = require('express');
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

const corsOptions = {
    origin: process.env.FRONT_APP_HOST,
    credentials: true,
};




// middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("../public"));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use("/api", routes);

// routes
app.use("/",routes);



app.use("/api",routes );
module.exports = app;
