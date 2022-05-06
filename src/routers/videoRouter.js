import express from "express";
import {edit, deleteVideo} from "../controllers/videoController";
const videoRouter = express.Router();
videoRouter.get("/edit", edit);
videoRouter.get("/remove", remove);

export default videoRouter;