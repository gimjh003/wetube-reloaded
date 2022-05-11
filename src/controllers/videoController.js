const fakeUser = {
    username: "Me",
    loggedIn: true
};
const videos = [
    {title: "sweet home",
     rating: 5,
     comments: 10,
     createdAt: "me",
     views: 100},
    {title: "sweet home",
     rating: 5,
     comments: 10,
     createdAt: "me",
     views: 100},
    {title: "sweet home",
     rating: 5,
     comments: 10,
     createdAt: "me",
     views: 100},
    {title: "sweet home",
     rating: 5,
     comments: 10,
     createdAt: "me",
     views: 100},
];
export const trending = (req, res) => res.render("home", {pageTitle: "Home", fakeUser: fakeUser, videos: videos});
export const see = (req, res) => res.render("watch", {pageTitle: "Watch"});
export const edit = (req, res) => res.render("edit", {pageTitle: "Edit"});
export const upload = (req, res) => res.send("Upload video")
export const remove = (req, res) => res.send("Remove video");
export const search = (req, res) => res.send("Search");