const express = require("express");

const {loginUser ,registerUser,logoutUser } = require("../controllers/auth.controller");


const router =express.Router();


router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/logout",logoutUser)

// router.post("login",loginUser),
// router.post("/forget",forgetPassword)
// router.post("/verify",verifyToken)
// router.post("/resetPassword",resetPassword)
// router.post("/refresh",refreshAccessToken);

module.exports = router;
