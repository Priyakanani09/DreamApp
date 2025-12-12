const express = require("express");
const router = express.Router();
const verifytoken = require("../middlewares/verifyAuth");
const userprofile = require("../controller/userController");
const registered = require("../controller/registerController")
const login = require("../controller/logincontroller")
const expertController = require("../controller/expertController");

//register 
router.post("/register",verifytoken,registered.register)
router.post("/login",verifytoken,login.logindata);

//craeteprofile
router.post("/profile",userprofile.createprofile);
router.get("/getprofile",userprofile.getUser);
router.delete("/Deleteuser/:uid",userprofile.deleteUser);
router.put("/Updateuser/:uid",userprofile.updateUser);

//expert data
router.post("/expert", expertController.createExpertProfile);
router.get("/getexpert", expertController.getExpertProfileByUser);
module.exports = router;
