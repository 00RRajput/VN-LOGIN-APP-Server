const app = require("../app");
const express = require("express");
const AuthController = require("../Controllers/AuthController");

const router = express.Router();

function appRouter() {
    app.use("/v1",
        router
        .post('/auth/reg', AuthController.register)
        .post('/auth/login', AuthController.login)
        .get('/auth/get', AuthController.getUser)
        .post('/auth/logout', AuthController.logout)
    )
}

module.exports = appRouter;