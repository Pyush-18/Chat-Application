import { Router } from "express";
import { authUser, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { Jwt_verify } from "../middlewares/auth.middleware.js";
const router = Router()

router.route("/register").post(signup)
router.route("/login").post(login)
router.route("/logout").get( Jwt_verify , logout)

router.route("/update-profile").put(Jwt_verify, updateProfile)
router.route("/user").get(Jwt_verify, authUser)


export default router