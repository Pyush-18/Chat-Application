import { User } from "../models/user.model.js";
import {asyncHandler} from "../utils/AsyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import jwt from "jsonwebtoken"

export const Jwt_verify = asyncHandler(async(req, res , next) => {
    try{
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if(!token){
            throw new ApiError(401, "Unauthorized request")
        }
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decode?._id)
        if(!user){
            throw new ApiError(401, "Unauthorized request")
        }

        req.user = user
        next()
    }catch(error){
        throw new ApiError(500, error?.message || "Internal server error")
    }
})