import {Router} from "express"
import { Jwt_verify } from "../middlewares/auth.middleware.js"
import { getMessages, getUsersforSidebar, sendMessage } from "../controllers/message.controller.js"
const router = Router()

router.route("/users").get( Jwt_verify ,getUsersforSidebar)
router.route("/:id").get( Jwt_verify ,getMessages)
router.route("/send/:id").post( Jwt_verify ,sendMessage)

export default router