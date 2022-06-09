import express from "express";
import { registerView, leaveComment, deleteComment } from "../controllers/videoController";
import { protectorMiddleware } from "../middlewares";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", protectorMiddleware, leaveComment);
apiRouter.delete("/comments/:id([0-9a-f]{24})/delete", protectorMiddleware, deleteComment);

export default apiRouter;