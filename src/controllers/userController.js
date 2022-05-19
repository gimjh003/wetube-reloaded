import User from "../models/User";
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
    const user = await User.findOne({username});
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
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const logout = (req, res) => res.send("Logout");
export const see = (req, res) => res.send("See User");