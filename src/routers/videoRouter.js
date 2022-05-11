import express from "express";
import {getEdit, postEdit, watch} from "../controllers/videoController";
const videoRouter = express.Router();
videoRouter.get("/:id", watch);
videoRouter.get("/:id/edit", getEdit);
videoRouter.post("/:id/edit", postEdit);

export default videoRouter;