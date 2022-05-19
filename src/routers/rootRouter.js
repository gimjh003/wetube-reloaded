import express from "express";
import {getJoin, postJoin, getLogin, postLogin} from "../controllers/userController";
import {home, search} from "../controllers/videoController";
const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.route("/login").post(postLogin).get(getLogin);
rootRouter.get("/search", search);

export default rootRouter;