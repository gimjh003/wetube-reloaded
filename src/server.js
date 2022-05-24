import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import morgan from "morgan";
import {localsMiddleware} from "./middlewares";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

// const express = require("express");

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd()+"/src/views");
app.set("x-powered-by", false);
app.use(logger);
app.use(express.urlencoded({extended: true}));
app.use(session({secret: process.env.COOKIE_SECRET, 
                 resave: false, 
                 saveUninitialized: false,
                 store: MongoStore.create({mongoUrl: process.env.DB_URL}),
                }));
app.use(localsMiddleware)
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;