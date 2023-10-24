export function isAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        res.locals.user = {
            first_name:req.user.first_name,
            last_name:req.user.last_name,
            role:req.user.role,
            email:req.user.email,
            isAdmin:req.user.role === 'admin',
        }
        return next()
    }else{
        res.redirect("/login")
    }
}
export function isAdmin(req, res, next){
    if(req.isAuthenticated() && req?.user?.role === "admin"){
        return next()
    }else{
        res.redirect("/")
    }
}