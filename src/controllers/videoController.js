import Video from "../models/Video";
import User from "../models/User";
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
    try{
        const videos = await Video.find({}).sort({createdAt: "desc"});
        return res.render("home", {pageTitle: "Home", videos});
    }
    catch(error){
        return res.render("server-error", {error}); 
    }
}
export const watch = async(req, res) => {
    const {id} = req.params;
    const video = await (await Video.findById(id)).populate("owner");
    console.log(video);
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
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndUpdate(id, {title,
                                 description,
                                 hashtags: Video.formatHashtags(hashtags)});
    return res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => {
    return res.render("upload", {pageTitle: "Upload Video"});
};
export const postUpload = async(req, res) => {
    const {_id} = req.session.user;
    const {title, description, hashtags} = req.body;
    const {path:fileUrl} = req.file;
    try{
        const newVideo = await Video.create({
            title,
            fileUrl,
            description,
            hashtags: Video.formatHashtags(hashtags),
            owner: _id,
        });
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        await user.save()
    } catch(error) {
        return res.status(400).render("upload", {pageTitle: "Upload Video", errorMessage: error._message});
    }
    return res.redirect("/");
};

export const deleteVideo = async(req, res) => {
    const {user: {_id}} = req.session;
    const {params:{id}} = req;
    const video = await Video.findOne({_id:id});
    if(!video){
        return res.render("404", {pageTitle: "Video not found."});
    }
    if(String(video.owner) !== _id){
        return res.status(304).redirect("/");
    };
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
};

export const search = async(req, res) => {
    const {keyword} = req.query;
    let videos = await Video.find({});
    if(keyword){
        videos = await Video.find({title: {$regex:new RegExp(keyword, "i")}});
        return res.render("search", {pageTitle:`Search by ${keyword}`, videos});
    };
    return res.render("search", {pageTitle: "Search", videos});
}