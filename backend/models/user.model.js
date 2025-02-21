import mongoose from "mongoose";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength:  [6, "Password length must be 6"]
    },
    profilePic: {
        type: String, // cloudinary
        default: ""
    },
    refreshToken: {
        type: String,
        default: ""
    }
},{timestamps: true})

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")){
        return next()
    }
    this.password = await bcryptjs.hash(this.password, 10)
})

userSchema.methods.comparePassword = async function(password){
    return await bcryptjs.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",userSchema)