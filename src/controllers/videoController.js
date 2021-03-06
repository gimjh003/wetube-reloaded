import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";
/*
export const home = (req, res) => {
    Video.find({}, (error, videos) => {
        console.log("error", error);
        console.log("videos", videos);
        return res.render("home", {pageTitle: "Home", videos});
    });
};
*/
export const home = async(req, res) => {
    res.locals.keyword = "";
    try{
        const videos = await Video.find({}).sort({createdAt: "desc"}).populate("owner");
        return res.render("home", {pageTitle: "Home", videos});
    }
    catch(error){
        return res.render("server-error", {error}); 
    }
}
export const watch = async(req, res) => {
    const {id} = req.params;
    console.log(req.params);
    const video = await Video.findById(id).populate("owner").populate("comments");
    for(const comment in video.comments){
        video.comments[comment].owner = await User.findById(video.comments[comment].owner);
    }
    if(video === null){
        return res.render("404", {pageTitle:"Video not found."});
    };
    return res.render("watch", {pageTitle: video.title, video});
}
export const getEdit = async(req, res) => {
    const {id} = req.params;
    const {user: {_id}} = req.session;
    const video = await Video.findById(id);
    if(!video){
        return res.status(404).render("404", {pageTitle: "Video not found."});   
    };
    if(String(video.owner) !== _id){
        return res.status(403).redirect("/");
    }
    return res.render("edit", {pageTitle: `Edit ${video.title}`, video});
}
export const postEdit = async(req, res) => {
    const {user: {_id}}=req.session;
    const {id} = req.params;
    const {title, description, hashtags} = req.body;
    const video = await Video.findOne({_id: id});
    if(!video){
        return res.status(404).render("404", {pageTitle: "Video not found."});
    }
    if(String(video.owner) !== _id){
        req.flash("error", "ACCESS DENIED");
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndUpdate(id, {title,
                                 description,
                                 hashtags: Video.formatHashtags(hashtags)});
    req.flash("info", "VIDEO UPDATED");
    return res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => {
    return res.render("upload", {pageTitle: "Upload Video"});
};
export const postUpload = async(req, res) => {
    const {_id} = req.session.user;
    const {title, description, hashtags} = req.body;
    const {
        video,
        thumb,
    } = req.files;
    try{
        const newVideo = await Video.create({
            title,
            fileUrl: video[0].location,
            thumbUrl: thumb[0].location,
            description,
            hashtags: Video.formatHashtags(hashtags),
            owner: _id,
        });
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        await user.save()
    } catch(error) {
        req.flash("error", error._message);
        return res.status(400).render("upload", {pageTitle: "Upload Video"});
    }
    return res.redirect("/");
};

export const deleteVideo = async(req, res) => {
    const {user} = req.session;
    const {params:{id}} = req;
    const video = await Video.findOne({_id:id});
    if(!video){
        return res.render("404", {pageTitle: "Video not found."});
    }
    if(String(video.owner) !== user._id){
        req.flash("error", "ACCESS DENIED");
        return res.status(304).redirect("/");
    };
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
};

export const search = async(req, res) => {
    const {keyword} = req.query;
    res.locals.keyword = keyword;
    let videos = await Video.find({}).populate("owner");
    if(keyword){
        videos = await Video.find({title: {$regex:new RegExp(keyword, "i")}}).populate("owner");
        return res.render("search", {pageTitle:`Search by ${keyword}`, videos});
    };
    return res.render("search", {pageTitle: "Search", videos});
}

export const registerView = async(req, res) => {
    const {id} = req.params;
    const video = await Video.findById(id);
    if(!video){
        return res.sendStatus(404);
    }
    video.meta.views = video.meta.views += 1;
    await video.save();
    return res.sendStatus(200);
};

export const leaveComment = async(req, res) => {
    const {
        params:{id},
        session:{user},
        body:{text},
    } = req;
    const video = await Video.findById(id);
    if(!video){
        return res.sendStatus(404);
    };
    const comment = await Comment.create({
        text,
        owner: user._id,
        video: id,
    })
    video.comments.push(comment._id);
    await video.save();
    const realUser = await User.findById(user._id);
    realUser.comments.push(comment._id);
    await realUser.save();
    return res.status(201).json({commentId:comment._id});
};

export const deleteComment = async(req, res) => {
    const {
        params:{id},
        session:{user},
        body:{videoId},
    } = req;
    const comment = await Comment.findById(id);
    const owner = await User.findById(comment.owner);
    const video = await Video.findById(videoId);
    if(String(user._id) !== String(owner._id)){
        return res.sendStatus(403);
    }
    owner.comments.splice(owner.comments.indexOf(id), 1);
    video.comments.splice(video.comments.indexOf(id), 1);
    owner.save();
    video.save();
    await Comment.findByIdAndDelete(id);
    return res.sendStatus(201);
};