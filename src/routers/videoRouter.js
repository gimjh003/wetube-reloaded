import express from "express";
import {getEdit, postEdit, getUpload, postUpload, watch} from "../controllers/videoController";
const videoRouter = express.Router();
videoRouter.route("/upload").get(getUpload).post(postUpload);
videoRouter.get("/:id", watch);
videoRouter.route("/:id/edit").get(getEdit).post(postEdit);

export default videoRouter;