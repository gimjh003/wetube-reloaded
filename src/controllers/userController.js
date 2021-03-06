import User from "../models/User";
import Video from "../models/Video";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
    return res.render("users/join", {pageTitle: "Join"});
};
export const postJoin = async(req, res) => {
    const {name, email, username, password, password2, location} = req.body;
    if(password !== password2){
        req.flash("error", "Password confirmation does not match.");
        return res.status(400).render("users/join", {pageTitle: "Join"});
    }
    const userExists = User.exists({$or : [{username}, {email}]});
    if(!userExists){
        req.flash("error", "This username/email is already taken.");
        return res.status(400).render("users/join", {pageTitle: "Join"});
    }
    try{
        await User.create({
            email,
            username,
            password,
            name,
            location,
        })
    } catch(error){
        req.flash("error", error);
        return res.status(400).render("users/join", {pageTitle: "Join"});
    }
    return res.redirect("/login");
};
export const getLogin = (req, res) => {
    return res.render("users/login", {pageTitle: "Login"});
};
export const postLogin = async(req, res) => {
    const pageTitle = "Login";
    const {username, password} = req.body;
    const user = await User.findOne({username, socialOnly: false});
    if(!user){
        req.flash("error", "An account with this username does not exists.");
        return res.status(400).render("users/login", {pageTitle});
    }
    const ok = await bcrypt.compare(password, user.password);
    if(!ok){
        req.flash("error", "Wrong password.");
        return res.status(400).render("users/login", {pageTitle});
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
};
export const startGithubLogin = (req, res) => {
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: "read:user user:email"
    }
    const params = new URLSearchParams(config).toString();
    const baseUrl = `https://github.com/login/oauth/authorize?${params}`;
    return res.redirect(baseUrl);
};
export const finishGithubLogin = async(req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token"
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await(await fetch(finalUrl, {
        method:"POST",
        headers: {
            Accept: "application/json",
        },
    })).json()
    if("access_token" in tokenRequest){
        const {access_token} = tokenRequest;
        const apiUrl = "https://api.github.com"
        const userRequest = await(await fetch(`${apiUrl}/user`, {
            headers: {
                Authorization: `token ${access_token}`,
            }
        })).json();
        const emailData = await(await fetch(`${apiUrl}/user/emails`, {
            headers: {
                Authorization: `token ${access_token}`,
            },
        })).json();
        const emailObj = emailData.find(email => email.primary === true && email.verified === true);
        if(!emailObj){
            return res.redirect("/login");
        }
        let user = await User.findOne({email: emailObj.email});
        if(!user){
            user = await User.create({
                name: userRequest.name,
                email: emailObj.email,
                username: userRequest.login,
                password: "",
                location: userRequest.location,
                socialOnly: true,
                avatarUrl: userRequest.avatar_url,
            });
        }
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
    } else{
        return res.redirect("/login");
    }
};
export const getEdit = (req, res) => {
    return res.render("users/edit-profile", {pageTitle: "Edit Profile"});
};
export const postEdit = async(req, res) => {
    const {
        session: {
            user: {_id, avatarUrl, username: currentUsername, email: currentEmail},
        },
        body: { name, email, username, location },
        file
    } = req;
    if(currentUsername != username){
        const check = await User.exists({username});
        if(check){
            req.flash("error", "This username is already taken.");
            return res.redirect("/users/edit");
        }
    }
    if(currentEmail != email){
        const check = await User.exists({email});
        if(check){
            req.flash("error", "This email is already exists.");
            return res.redirect("/users/edit");
        }
    }
    const updatedUser = await User.findByIdAndUpdate(_id, {
        avatarUrl: file? file.location:avatarUrl, name, email, username, location,
    }, {new: true});
    req.session.user = updatedUser;
    return res.redirect("/users/edit");
};
export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/"); 
};
export const getChangePassword = (req, res) => {
    if(req.session.user.socialOnly){
        return res.status(403).redirect("/users/edit");
    }
    return res.render("users/change-password", {pageTitle: "Change Password"});
};
export const postChangePassword = async(req, res) => {
    const {
        session: {
            user: {_id, socialOnly, password},
        },
        body: {oldPassword, newPassword, newPasswordConfirm},
    } = req
    if(socialOnly){
        return res.redirect("/users/edit");
    }
    const user = await User.findById(_id);
    const ok = await bcrypt.compare(oldPassword, password)
    if(!ok){
        req.flash("error", "The current password is incorrect.");
        return res.status(400).render("users/change-password", {pageTitle: "Change Password"});
    }
    if(newPassword != newPasswordConfirm){
        req.flash("error", "The new password doesn't match the confirmation.");
        return res.status(400).render("users/change-password", {pageTitle: "Change Password"});
    }
    user.password = newPassword;
    await user.save()
    req.flash("info", "PASSWORD CHANGED");
    return res.redirect("/users/logout");
}
export const see = async(req, res) => {
    const{
        params:{id},
    }=req;
    const user = await (await User.findById(id)).populate("videos");
    if(!user){
        return res.status(404).render("404", {pageTitle: "User Not Found"});
    }
    return res.render("users/profile", {pageTitle: user.username, user});
};