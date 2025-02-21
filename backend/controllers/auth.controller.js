import { User } from "../models/user.model.js";
import {asyncHandler} from "../utils/AsyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { generateAccessAndRefreshToken } from "../utils/generateToken.js";
import { uploadImage } from "../utils/cloudinary.js";


export const signup = asyncHandler(async(req, res) => {
    const {fullName, email, password} = req.body
    if([fullName, email, password].some((field) => field?.trim() === "")){
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({email})
    if(existedUser){
        throw new ApiError(400, "User with this email already exists")
    }

    const newUser =  await User.create({fullName, email, password})
    await newUser.save()

    const registeredUser = await User.findById(newUser?._id).select("-password")

    return res.status(200)
    .json( new ApiResponse(201, registeredUser, "User Signup successfully"))
})

export const login = asyncHandler(async(req, res) => {
    const {email, password} = req.body
    if(!email || !password){
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findOne({email})
    if(!user){
        throw new ApiError(400, "Invalid credentials")
    }

    const isPasswordMatch = await user.comparePassword(password)
    if(!isPasswordMatch){
        throw new ApiError(400, "Invalid credentials")
    }

    const loggedInUser = await User.findById(user?._id).select("-password")

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user?._id)

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24*60*60*1000
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(201, loggedInUser, "User logged in successfully")
    )
})

export const logout = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                refreshToken: ""
            }
        },
        {
            new : true
        }
    )

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 0
    }

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(201, {}, "User logout successfully")
    )
})

export const updateProfile = asyncHandler(async(req, res) => {
    const {profilePic} = req.body
    const profileUrl = await uploadImage(profilePic)
    if(!profileUrl){
        throw new ApiError(400, profileUrl)
    }
    const profileUpdate = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                profilePic: profileUrl?.secure_url
            }
        },
        {
            new : true
        }
    ).select("-password -refreshToken")

    if(!profileUpdate){
        throw new ApiError(400, "Issue while updating the profile")
    }

    return res.status(200)
    .json(new ApiResponse(200, profileUpdate, "Profile updated successfully"))
})

export const authUser = asyncHandler(async(req, res) => {
    return res.status(200)
    .json(new ApiResponse(200, req.user, "Auth user fetched successfully"))
})