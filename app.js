const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
// require('./Constants/process.status')

const app = express();

app.use(cors({
    origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    exposedHeaders: ['x-server-errortype']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '7mb' }));
app.use(cookieParser());
app.use(express.static('Public'))

module.exports = app;