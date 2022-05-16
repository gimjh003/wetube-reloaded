import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    createdAt: {type: Date, required: true},
    hashtags: [{type: String}],
    meta: {
        views:Number,
        rating:Number,
    },
});

const movieModel = mongoose.model("Video", videoSchema);
export default movieModel;