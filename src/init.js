import regeneratorRuntime from "regenerator-runtime";
import "dotenv/config";
import "./db";
import Video from "./models/Video";
import User from "./models/User";
import Comment from "./models/Comment";
import app from "./server";

const PORT = 4000;

const handleListening = () => console.log(`Server listening on http://localhost:${PORT}`);
app.listen(PORT, handleListening);