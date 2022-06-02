import express from "express";
import { append } from "express/lib/response";
import {getJoin, postJoin, getLogin, postLogin} from "../controllers/userController";
import {home, search} from "../controllers/videoController";
import { publicOnlyMiddleware } from "../middlewares";
const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter.route("/login").all(publicOnlyMiddleware).post(postLogin).get(getLogin);
rootRouter.get("/search", search);

export default rootRouter;