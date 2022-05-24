import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
    return res.render("join", {pageTitle: "Join"});
};
export const postJoin = async(req, res) => {
    const {name, email, username, password, password2, location} = req.body;
    if(password !== password2){
        return res.status(400).render("join", {pageTitle: "Join", errorMessage: "Password confirmation does not match."});
    }
    const userExists = User.exists({$or : [{username}, {email}]});
    if(!userExists){
        return res.status(400).render("join", {pageTitle: "Join", errorMessage: "This username/email is already taken."});
    }
    try{
        await User.create({
            name,
            email,
            username,
            password,
            location,
        })
    } catch(error){
        return res.status(400).render("join", {pageTitle: "Join", errorMessage: error});
    }
    return res.redirect("/login");
};
export const getLogin = (req, res) => {
    return res.render("login", {pageTitle: "Login"});
};
export const postLogin = async(req, res) => {
    const pageTitle = "Login";
    const {username, password} = req.body;
    const user = await User.findOne({username, socialOnly: false});
    if(!user){
        return res.status(400).render("login", {pageTitle, errorMessage: "An account with this username does not exists."});
    }
    const ok = await bcrypt.compare(password, user.password);
    if(!ok){
        return res.status(400).render("login", {pageTitle, errorMessage: "Wrong password."});
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
            const user = await User.create({
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
export const edit = (req, res) => res.send("Edit User");
export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};
export const see = (req, res) => res.send("See User");