export const localsMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.loggedInBy = req.session.user;
    res.locals.siteName = "Wetube";
    next();
}