import { Router } from "express";

import { 
    changeCurrentUserPassword, 
    getCurrentUser, 
    getUserProfile, 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    registerUser, 
    updateAccountDetails,
    updateUserAvatar,
} from "../controllers/user.controller.js";

import {upload} from '../middleware/multer.middleware.js'
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()

// working
router.route("/register").post(
    upload.single("avatar"),
    registerUser
)

// working
router.route("/login").post(loginUser)

// secured routes
// working
router.route("/logout").post(
    verifyJWT,
    logoutUser
)

// working
router.route("/refreshToken").post(refreshAccessToken)

// working
router.route("/changePassword").post(verifyJWT, changeCurrentUserPassword)
// working
router.route("/current-user").post(verifyJWT, getCurrentUser)
// working
router.route("/update-account").patch(verifyJWT, updateAccountDetails)
// working
router.route("/update-avatar").patch(
    verifyJWT,
    upload.single("avatar"),
    updateUserAvatar
)

// working
router.route("/c/:username").get(verifyJWT, getUserProfile)


export default router