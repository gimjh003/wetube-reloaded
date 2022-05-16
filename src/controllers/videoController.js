import Video from "../models/Video";
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
        const videos = await Video.find({});
        return res.render("home", {pageTitle: "Home", videos});
    }
    catch(error){
        return res.render("server-error", {error}); 
    }
}
export const watch = (req, res) => {
    const {id} = req.params;
    return res.render("watch", {pageTitle: "Watch"});
}
export const getEdit = (req, res) => {
    const {id} = req.params;
    return res.render("edit", {pageTitle: `Edit`});
}
export const postEdit = (req, res) => {
    const {id} = req.params;
    const {title} = req.body;
    console.log(title);
    return res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => {
    return res.render("upload", {pageTitle: "Upload Video"});
};
export const postUpload = async(req, res) => {
    const {body: {title, description, hashtags}} = req;
    try{
        await Video.create({
            title,
            description,
            createdAt: Date.now(),
            hashtags: hashtags.split(",").map(word => `#${word}`),
            meta: {
                views: 0,
                rating: 0,
            },
        });
    } catch(error) {
        return res.render("upload", {pageTitle: "Upload Video", errorMessage: error._message});
    }
    return res.redirect("/");
};