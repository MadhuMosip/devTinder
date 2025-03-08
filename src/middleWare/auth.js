const AdminAuth = (req, res, next) => {
  let token = "XYZ";
  let isAuthorized = token === "XYZ";
  if (!isAuthorized) {
    res.status(401).send("Authontication failed");
  } else {
    next();
  }
};

const UserAuth = (req,res,next) =>{
    let token = "XYZ";
    let isAuthorized = token === "XYZ";
    if(!isAuthorized){
        res.status(401).send("authonatication failed");
    }else{
        next();
    }
}


module.exports = {
    AdminAuth,
    UserAuth
}