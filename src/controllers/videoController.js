const fakeUser = {
    username: "Me",
    loggedIn: true
};
let videos = [
    {title: "sweet home",
     rating: 4,
     comments: 108,
     createdAt: "me",
     views: 167,
     id: 0},
    {title: "bitter home",
     rating: 0,
     comments: 1287,
     createdAt: "me",
     views: 1287,
     id: 1},
    {title: "spicy home",
     rating: 5,
     comments: 2972,
     createdAt: "me",
     views: 4847,
     id: 2},
    {title: "sour home",
     rating: 2,
     comments: 0,
     createdAt: "me",
     views: 1,
     id: 3},
];
export const trending = (req, res) => res.render("home", {pageTitle: "Home", fakeUser, videos});
export const watch = (req, res) => {
    const {id} = req.params;
    const video = videos[id];
    return res.render("watch", {pageTitle: `Watching : ${video.title}`, video});
}
export const getEdit = (req, res) => {
    const {id} = req.params;
    const video = videos[id]
    return res.render("edit", {pageTitle: `Editing : ${video.title}`, video});
}
export const postEdit = (req, res) => {
    const {id} = req.params;
    const {title} = req.body;
    videos[id].title = title;
    console.log(title);
    return res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => {
    return res.render("upload", {pageTitle: "Upload Video"});
};
export const postUpload = (req, res) => {
    const {body: {title}} = req
    const newVideo = {
        title: title,
        rating: 0,
        comments: 0,
        createdAt: "just now",
        views: 0,
        id: videos.length,
    };
    videos.push(newVideo);
    return res.redirect("/");
};